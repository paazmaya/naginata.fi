<?php
/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <olavic@gmail.com>
 * http://creativecommons.org/licenses/by-sa/3.0/
 *
 * A class for outputting HTML5 stuff.
 * Let's see how many times the buzzword HTML5 can be repeated.
 *
 * Usage:
 *  $shih = new ShikakeOjiPage();
 *  echo $shih->renderHtml();
 */
require 'Markdown.php';

class ShikakeOjiPage
{
    /**
     * How will JS and CSS files will be called once minified in to one file per type?
     *
     * Compressed files are delivered via Apache.
     */
    public $minifiedName = 'naginata.min.';

    /**
     * Instance of a ShikakeOji class.
     */
    private $shikakeOji;

    /**
     * Markup for navigation
     */
    private $navigation;

    /**
     * Data used for the head section.
     * Contains keys: url, header, title, description
     */
    private $head;

    /**
     * Constructor does not do much.
     */
    function __construct($shikakeOji)
    {
        if (!isset($shikakeOji) || !is_object($shikakeOji))
        {
            return false;
        }

        // Must be defined in order to access data and config.
        $this->shikakeOji = $shikakeOji;

        // Create navigation for later use
        $navigation = '';
        foreach ($shikakeOji->appData['pages'] as $pages)
        {
            if (substr($pages['url'], 1, 2) == $this->shikakeOji->language)
            {
                $navigation .= '<li';
                if ($this->shikakeOji->currentPage == $pages['url'])
                {
                    $navigation .= ' class="current"';
                    $this->head = $pages; // head section data
                }
                $navigation .= '><a href="' . $pages['url'] . '" title="' .
                  $pages['header'] . '" rel="prefetch">' . $pages['title'] . '</a></li>';
            }
        }
        $this->navigation = $navigation;
    }

    /**
     * Render the HTML5 markup by the appData and options.
     */
    public function renderHtml()
    {
        $out = $this->createHtmlPage();

        return $out;
    }

    /**
     * Create the whole HTML5 markup with content specific to this page and login status.
     * http://html5doctor.com/element-index/
     *
     * Remember to validate http://validator.w3.org/
     *
     * @return    string    HTML5 markup
     */
    private function createHtmlPage()
    {
        if (!isset($this->head))
        {
            return '<p class="fail">Navigation data for this page missing</p>';
        }

        $data = $this->shikakeOji->appData;

        $out = $this->createHtmlHead($data['title'][$this->shikakeOji->language]);
        
        $name = str_replace('/', '', substr($this->head['url'], 3));
        if ($name === '')
        {
            $name = 'index';
        }

        $path = '../content/' . $this->shikakeOji->language . '/' . $name . '.md';

        if (file_exists($path))
        {
            $markdown = file_get_contents($path);

            $out .= '<article class="' . strtolower($this->head['title']) . '">';
            $out .= \Michelf\Markdown::defaultTransform($markdown);
            $out .= '</article>';
        }
        else
        {
            return '<p class="fail">Article data for this page missing</p>';
        }

        $out .= $this->createHtmlFooter($data['footer'][$this->shikakeOji->language]);

        return $out;
    }

    /**
     * Create HTML5 head
     * $title = $data['title'][$this->shikakeOji->language]
     */
    private function createHtmlHead($title)
    {
        // None of the OGP items validate, as well as using prefix in html element...
        $out = '<!DOCTYPE html>';
        $out .= '<html lang="' . $this->shikakeOji->language . '"';
        //$out .= ' manifest="applicaton.cache"'; // http://www.html5rocks.com/en/tutorials/appcache/beginner/
        if (strpos($_SERVER['HTTP_USER_AGENT'], 'facebookexternalhit') !== false)
        {
            $out .= ' prefix="og:http://ogp.me/ns#"'; // http://dev.w3.org/html5/rdfa/
        }
        $out .= '>';
        $out .= '<head>';
        $out .= '<meta charset="utf-8"/>';
        $out .= '<title>' . $this->head['header'] . ' | ' . $title . '</title>';
        $out .= '<meta name="description" content="' . $this->head['description'] . '"/>';
        $out .= '<link rel="shortcut icon" href="/img/favicon.png" type="image/png"/>';

        // Web Fonts from Google.
        $out .= '<link href="http://fonts.googleapis.com/css?family=Inder|Lora&subset=latin-ext,latin" rel="stylesheet" type="text/css"/>';

        if (strpos($_SERVER['HTTP_USER_AGENT'], 'facebookexternalhit') !== false)
        {
            $out .= $this->facebookMeta();
        }

        // Developer guidance for websites with content for Adobe Flash Player in Windows 8
        // http://msdn.microsoft.com/en-us/library/ie/jj193557%28v=vs.85%29.aspx
        $out .= '<meta http-equiv="X-UA-Compatible" content="requiresActiveX=true" />';

        // http://microformats.org/wiki/rel-license
        $out .= '<link rel="license" href="http://creativecommons.org/licenses/by-sa/3.0/"/>';
        $out .= '<link rel="author" href="http://paazmaya.com"/>';

        // https://developer.apple.com/library/safari/#documentation/appleapplications/reference/safariwebcontent/configuringwebapplications/configuringwebapplications.html
        $out .= '<link rel="apple-touch-icon" href="/img/mobile-logo.png"/>'; // 57x57

        $out .= '<link rel="stylesheet" href="/css/' . $this->minifiedName . 'css" type="text/css" media="all" />';

        $out .= '</head>';

        $out .= '<body>';

        $out .= '<nav><ul>' . $this->navigation . '</ul></nav>';

        $out .= '<div id="wrapper">';

        // Enabled languages
        $out .= '<ul id="languages">';
        foreach ($this->shikakeOji->appData['languages'] as $key => $language)
        {
            if ($language['enabled'] === true && $key !== $this->shikakeOji->language)
            {
                $out .= '<li><a href="/' . $key . '" title="' .
                    $language['name'] . '">' . $language['name'] . '</a></li>';
            }
        }
        $out .= '</ul>';

        // div#logo tag shall contain all the message data, if needed
        $out .= '<div id="logo">';
        $out .= '<p>' . $title . '</p>';
        $out .= '</div>';

        $out .= '<header>';
        $out .= '<h1>' . $this->head['header'] . '</h1>';
        $out .= '<p class="desc-transform">' . $this->head['description'] . '</p>';
        $out .= '</header>';

        return $out;
    }

    /**
     * Facebook specific meta data.
     * @return string
     */
    private function facebookMeta()
    {
        // http://ogp.me/
        $out = '<meta property="og:title" content="' . $this->head['title'] . '"/>';
        $out .= '<meta property="og:description" content="' . $this->head['description'] . '"/>';
        $out .= '<meta property="og:type" content="sports_team"/>';

        // All the images referenced by og:image must be at least 200px in both dimensions.
        $out .= '<meta property="og:image" content="http://' . $_SERVER['HTTP_HOST'] . '/img/logo-200x200.png"/>';

        $out .= '<meta property="og:url" content="http://' . $_SERVER['HTTP_HOST'] . $this->shikakeOji->currentPage . '"/>';
        $out .= '<meta property="og:site_name" content="' . $this->head['title'] . '"/>';
        $out .= '<meta property="og:locale" content="fi_FI"/>'; // language_TERRITORY
        $out .= '<meta property="og:locale:alternate" content="en_GB"/>';
        $out .= '<meta property="og:locale:alternate" content="ja_JP"/>';
        //$out .= '<meta property="og:country-name" content="Finland"/>';

        // https://developers.facebook.com/docs/opengraph/
        $out .= '<meta property="fb:app_id" content="' . $this->shikakeOji->appData['facebook']['app_id'] . '"/>'; // A Facebook Platform application ID that administers this page.
        $out .= '<meta property="fb:admins" content="' . $this->shikakeOji->appData['facebook']['admins'] . '"/>';

        return $out;
    }

    /**
     * Create HTML5 footer.
     * $data = $data['footer'][$this->shikakeOji->language]
     */
    private function createHtmlFooter($data)
    {
        $out = '</div>';

        $out .= '<footer>';
        $out .= '<p>';

        $links = array();
        foreach ($data as $item)
        {
            $a = '<a href="' . $item['url'] . '" title="' . $item['alt'] .
                '">' . $item['text'] . '</a>';
            $links[] = $a;
        }

        $out .= implode('|', $links);

        $out .= '</footer>';

        $out .= '<script type="text/javascript" src="/js/' . $this->minifiedName . 'js"></script>';

        $out .= '</body>';
        $out .= '</html>';

        return $out;
    }

}
