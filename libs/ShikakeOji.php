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
 *    realpath('../naginata-data.json'),
 *    realpath('../naginata-config.json')
 *  );
 *  echo $shio->renderPage();
 */
require 'ShikakeOjiPage.php';

class ShikakeOji
{
    /**
     * What is the version of this class?
     */
    public static $VERSION = '0.15';

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
     * Configuration for Emails sending, 3rd party API keys, etc.
     * See "naginata-config.json.dist" for possible keys.
     */
    public $config;

    /**
     * Application data, decoded from JSON string which is loaded
     * from $this->dataPath.
     */
    public $appData;

    /**
     * PDO connected database connection.
     * Page content, moderated content are stored here.
     * http://php.net/pdo
     */
    public $database;

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
     * Library path, which is used to find the other libraries included.
     */
    public $libPath = __DIR__;

    /**
     * Is the page internal, thus only ouputting JSON?
     * These require user to login via OAuth.
     */
    private $isInternalPage = false;

    /**
     * URLs used by the application, not for showing content.
     * These should be human readable English with dashes.
     * Key is the URL, value is the name of the function to be called.
     */
    private $appUrls = array(
        '/sitemap' => 'showSiteMap'
    );

    /**
     * Constructor will load the JSON data and decode it as well as
     * check for compression support of the client.
     * If loading fails, the process is not continued.
     */
    function __construct($dataPath, $configPath)
    {
        $this->loadConfig($configPath);

        $this->checkSession();

        $this->dataPath = $dataPath;
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
        $lowercase = isset($url['path']) ? strtolower($url['path']) : '/';

        // App urls shall be without language
        if (array_key_exists($lowercase, $this->appUrls))
        {
            // Application internal URLs. Allow query in the URL.
            $this->currentPage = $lowercase;
            $this->isInternalPage = true;
        }
        else
        {
            // Plain page related url
            $pageurl = substr($lowercase, 3);
            if ($pageurl === false)
            {
                $pageurl = '/';
            }

            // Remove all extra slashes
            $pageurl = '/' . str_replace('/', '', $pageurl);

            // Content
            $found = false;

            $sql =
                'SELECT * FROM naginata_page WHERE url = \'' . $pageurl . '\' AND lang = \'' . $this->language . '\'';
            $run = $this->database->query($sql);
            if ($run)
            {
                while ($res = $run->fetch(PDO::FETCH_ASSOC))
                {
                    if ($pageurl == $res['url']) // TODO: this it is of course but later add more logic
                    {
                        $this->currentPage = $pageurl;
                        $found = true;
                    }
                }
            }

            if (!$found)
            {
                // Not found
                $this->redirectTo('/', 404);
            }
            else
            {
                // Was the address found in lowercase?
                if ('/' . $this->language . $this->currentPage != $url['path'] || (isset($url['query']) && $url['query'] != ''))
                {
                    $this->redirectTo($this->currentPage);
                }
            }
        }
    }

    /**
     * Build a regular page with the content as per request.
     */
    public function renderPage()
    {
        if ($this->isInternalPage)
        {
            // These functions return a string/true or false on failure.
            $out = call_user_func(array($this, $this->appUrls[$this->currentPage]));

            // Other headers sent from the function above
            header('Content-Language: ' . $this->language);
            header('Last-modified: ' . date('r', time()));

            return $out;
        }
        else
        {
            $out = $this->output->renderHtml();
            header('Content-type: text/html; charset=utf-8');
            header('Content-Language: ' . $this->language);
            header('Last-modified: ' . date('r', $this->output->pageModified));

            return $out;
        }
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
            array_key_exists($candidate, $this->config['language']) &&
            $this->config['language'][$candidate]
        )
        {
            $this->language = $candidate;

            return true;
        }

        return false;
    }

    /**
     * Load the given JSON configuration file.
     * If it contains database connection values, connection will be open.
     */
    private function loadConfig($configPath)
    {
        if (!file_exists($configPath))
        {
            return false;
        }
        $this->config = json_decode(file_get_contents($configPath), true);

        $error = $this->getJsonError();
        if ($error != '')
        {
            header('Content-type: text/plain');
            header('X-Failure-type: config');
            echo $error;
            exit();
        }

        // PDO database connection if the settings are set.
        if (isset($this->config['database']) && isset($this->config['database']['type']) &&
            in_array($this->config['database']['type'], PDO::getAvailableDrivers())
        )
        {
            $attr = array();
            $dsn = $this->config['database']['type'] . ':';
            if ($this->config['database']['type'] != 'sqlite')
            {
                $dsn .= 'dbname=' . $this->config['database']['database'] . ';host=' . $this->config['database']['address'];
                $attr[PDO::MYSQL_ATTR_INIT_COMMAND] = 'SET NAMES utf8';
            }
            else
            {
                $dir = dirname($configPath);
                $dsn .= realpath($dir . '/' . $this->config['database']['address']);
            }

            $this->database = new PDO($dsn, $this->config['database']['username'],
                $this->config['database']['password'], $attr);

            $this->database->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
            $this->database->setAttribute(PDO::ATTR_ORACLE_NULLS, PDO::NULL_TO_STRING);
            $this->database->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        }
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
     * Show sitemap.xml
     */
    private function showSiteMap()
    {
        header('Content-type: text/xml');

        $out = '<?xml version="1.0" encoding="utf-8"?>';
        $out .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

        $lang = 'fi';
        $sql = 'SELECT P.url, MAX(A.modified) AS lastmod FROM naginata_page P' .
            ' LEFT JOIN naginata_article A ON P.id = A.page_id WHERE P.lang = \'' .
            $lang . '\' AND A.published = 1 GROUP BY A.page_id';
        $run = $this->database->query($sql);
        if ($run)
        {
            while ($res = $run->fetch(PDO::FETCH_ASSOC))
            {
                $out .= '<url>';
                $out .= '<loc>http://' . $_SERVER['HTTP_HOST'] . $res['url'] . '</loc>';
                $out .= '<lastmod>' . date('Y-m-d', $res['lastmod']) . '</lastmod>';
                $out .= '<changefreq>monthly</changefreq>';
                $out .= '</url>';
            }
        }
        $out .= '</urlset>';

        return $out;
    }

    /**
     * Redirect the client to the given URL with 301 (moved permanently) HTTP code.
     *
     * @param    string $url    Redirect to this URL within this domain
     */
    private function redirectTo($url, $code = '301')
    {
        $url = '/' . $this->language . $url;
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
