<?php
/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <olavic@gmail.com>
 * http://creativecommons.org/licenses/by-sa/3.0/
 *
 * A class for handling application flow.
 * Let's see how many times the buzzword HTML5 can be repeated.
 *
 * http://blog.thenounproject.com/post/7310229014/how-to-properly-attribute-cc-by-a-guest-blog-post-by
 *
 * Usage:
 *  $shio = new ShikakeOji(
 *    realpath('../content/page-data.json')
 *  );
 *  echo $shio->renderPage();
 */
require 'ShikakeOjiPage.php';

class ShikakeOji
{
    /**
     * What is the version of this class?
     */
    public static $VERSION = '0.17';

    /**
     * Current language, defaults to Finnish. Available languages are fi/en/ja.
     *
     * @see http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
     */
    public $language = 'fi';

    /**
     * Should be set to the realpath of the JSON file where app data is stored.
     */
    public $dataPath = '../content/page-data.json';

    /**
     * Application data, decoded from JSON string which is loaded
     * from $this->dataPath.
     */
    public $appData;

    /**
     * An instance of the ShikakeOjiPage class.
     */
    public $output;

    /**
     * Current page, as seen in the request url.
     * Needs to match the ones available in navigation.
     * Defaults to / as in front page.
     * All URLs are starting with forward slash.
     */
    public $currentPage = '/';

    /**
     * Constructor will load the JSON data and decode it as well as
     * check for compression support of the client.
     * If loading fails, the process is not continued.
     */
    function __construct($dataPath = null)
    {
        $this->checkSession();

        if ($dataPath !== null)
        {
            $this->dataPath = $dataPath;
        }
        $this->loadData();


        // Language setting based on browser values
        // If url empty, using browser, then default to fi
        if (isset($_SERVER['REQUEST_URI']))
        {
            if (!$this->checkLanguage(substr($_SERVER['REQUEST_URI'], 1, 2)))
            {
                if (isset($_SERVER['HTTP_ACCEPT_LANGUAGE']))
                {
                    $candidates = explode(',', $_SERVER['HTTP_ACCEPT_LANGUAGE']);
                    foreach ($candidates as $candidate)
                    {
                        if ($this->checkLanguage(substr($candidate, 0, 2)))
                        {
                            break; // Assume we have found a match
                        }
                    }
                }
            }
        }

        $this->checkRequestedPage();
        $this->output = new ShikakeOjiPage($this);
    }

    /**
     * Remove "www" prefix from the URL and redirect.
     * .htaccess should take care of this
     */
    public function removeWwwRedirect()
    {
        if (substr($_SERVER['HTTP_HOST'], 0, 3) == 'www')
        {
            $go = 'http://' . substr($_SERVER['HTTP_HOST'], 4) . $_SERVER['REQUEST_URI'];
            header('HTTP/1.1 301 Moved Permanently');
            header('Location: ' . $go);
            exit();
        }
    }

    /**
     * Check the $_SERVER['REQUEST_URI'] and set
     * the $this->currentPage variable for one that is found from navigation.
     * If nothing is matched, redirect to front page.
     * Matching is done first against application URLs and then content URLs via "nav".
     */
    public function checkRequestedPage()
    {
        if (!isset($_SERVER['REQUEST_URI']))
        {
            // How come, super variable not set?
            return false;
        }

        $url = parse_url($_SERVER['REQUEST_URI']); // use as such

        // URLs should only be lowercase, thus check and redirect later
        $lowercase = isset($url['path']) ? strtolower($url['path']) : '/' . $this->language;

        // Plain page related url
        $pageurl = trim($lowercase);

        // Remove the last slash
        //$pageurl = substr($pageurl, -1, 1) == '/' ? substr($pageurl, 0, -1) : $pageurl;

        // Content
        $found = false;

        // Keen.IO statistics
        if ($pageurl === '/navigation-timings')
        {
            $this->sendKeenStats('navigation timing');
            exit();
        }
        else if ($pageurl === '/resource-timings')
        {
            $this->sendKeenStats('resource timing');
            exit();
        }

        foreach ($this->appData['pages'] as $pages)
        {
            if ($pageurl == $pages['url'])
            {
                $this->currentPage = $pageurl;
                $found = true;
            }
        }

        if (!$found)
        {
            // Not found
            $this->redirectTo('/' . $this->language, 404);
        }
        else
        {
            // Was the address found in lowercase?
            if ($this->currentPage != $url['path'] || (isset($url['query']) && $url['query'] != ''))
            {
                $this->redirectTo($this->currentPage);
            }
        }
    }

    /**
     * Found from the $_POST data, the Page Timing statistics are send to Keen.IO.
     * @see https://keen.io/docs/getting-started-guide/
     */
    private function sendKeenStats($event = 'page timing')
    {
        require 'keen-keys.php';
        header('Content-type: application/json');

        // Convert string to array
        if (isset($_POST['entries']))
        {
            $_POST['entries'] = json_decode($_POST['entries']);
        }
        $json = json_encode($_POST);

        $curl = curl_init('https://api.keen.io/3.0/projects/' . $keen['projectId'] . '/events/' . $event . '?api_key=' . $keen['writeKey']);
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $json);
        echo curl_exec($curl);
        curl_close($curl);
    }

    /**
     * Build a regular page with the content as per request.
     */
    public function renderPage()
    {
        $out = $this->output->renderHtml();
        header('Content-type: text/html; charset=utf-8');
        header('Content-Language: ' . $this->language);
        header('Content-Security-Policy-Report-Only: default-src \'self\' ' .
          '*.vimeo.com *.youtube.com ' .
          '*.flickr.com *.staticflickr.com ' .
          '*.googleapis.com *.googleusercontent.com ' .
          '*.google-analytics.com');
        header('Accept-Ranges: bytes');

        return $out;
    }

    /**
     * Check for all session variables and restart session if needed.
     * Session should not be started elsewhere.
     */
    private function checkSession()
    {
        session_name('SOFI');
        session_start();

        $sid = sha1($_SERVER['REMOTE_ADDR'] . $_SERVER['HTTP_USER_AGENT']);

        if (!isset($_SESSION['sid']) || $_SESSION['sid'] != $sid || !isset($_SESSION['init']))
        {
            session_regenerate_id(); // updates the cookie if there is one

            // Must match the sha1 of REMOTE_ADDR and HTTP_USER_AGENT
            $_SESSION['sid'] = $sid;
            // When was the current session initiated? This is mainly intesting to see the true lifetime.
            $_SESSION['init'] = time();
        }

    }

    /**
     * Sets the langauge according to the order of language checking:
     * 1. Default fi, since site is in Finland
     * 2. First two characters of url followed by nothing or /
     * 3. Browser setting via $_SERVER['HTTP_ACCEPT_LANGUAGE'], which is first matching
     *
     * @param $candidate string Possible language ISO code from URL, if not false
     *
     * @return boolean True in case candidate matched
     */
    private function checkLanguage($candidate)
    {
        if ($candidate !== false &&
            array_key_exists($candidate, $this->appData['languages']) &&
            $this->appData['languages'][$candidate]['enabled']
        )
        {
            $this->language = $candidate;

            return true;
        }

        return false;
    }

    /**
     * Load the JSON data if available
     */
    private function loadData()
    {
        if ($this->dataPath != '' && file_exists($this->dataPath))
        {
            $json = file_get_contents($this->dataPath);
            $this->appData = json_decode($json, true);

            $error = $this->getJsonError();
            if ($error != '')
            {
                header('Content-type: text/plain');
                header('X-Failure-type: data');
                echo $error;
                exit();
            }
        }
    }

    /**
     * Redirect the client to the given URL with 301 (moved permanently) HTTP code.
     *
     * @param    string $url Redirect to this URL within this domain
     * @param string    $code
     */
    private function redirectTo($url, $code = '301')
    {
        if ($code != '')
        {
            $text = 'Moved Permanently';
            switch ($code)
            {
                case '404':
                    $text = 'Not Found';
                    break;

            }
            header('HTTP/1.1 ' . $code . ' ' . $text);
        }
        header('Location: http://' . $_SERVER['HTTP_HOST'] . $url);
        exit();
    }

    /**
     * http://www.php.net/manual/en/function.json-last-error.php
     *
     * @return    string
     */
    private function getJsonError()
    {
        switch (json_last_error())
        {
            case JSON_ERROR_NONE:
                return '';
                break;
            case JSON_ERROR_DEPTH:
                return 'Maximum stack depth exceeded';
                break;
            case JSON_ERROR_STATE_MISMATCH:
                return 'Underflow or the modes mismatch';
                break;
            case JSON_ERROR_CTRL_CHAR:
                return 'Unexpected control character found';
                break;
            case JSON_ERROR_SYNTAX:
                return 'Syntax error, malformed JSON';
                break;
            case JSON_ERROR_UTF8:
                return 'Malformed UTF-8 characters, possibly incorrectly encoded';
                break;
            default:
                return 'Unknown error';
                break;
        }
    }
}
