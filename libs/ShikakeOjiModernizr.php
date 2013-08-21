<?php
/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <olavic@gmail.com>
 * http://creativecommons.org/licenses/by-sa/3.0/
 *
 * Place to put stuff which should be removed at some point once the data has been examined.
 */
class ShikakeOjiModernizr
{


    /**
     * Render the Modernizr statistics table.
     * http://html5doctor.com/element-index/
     */
    public function renderModernizrTable()
    {
        $data = $this->shikakeOji->appData;

        $this->head = array(
            'title'       => 'Modernizr Statistics',
            'header'      => 'Modernizr Statistics',
            'description' => 'Modernizr Statistics'
        );

        $out = $this->createHtmlHead($data['title'][$this->shikakeOji->language]);

        // cache keys, some 70 maybe...
        $sql = 'SELECT * FROM mdrnzr_key ORDER BY title ASC';
        $run = $this->shikakeOji->database->query($sql);
        $keys = $run->fetchAll(PDO::FETCH_ASSOC);

        $out .= '<table class="stats">';
        $out .= '<caption>Total of Modernizr tests: ' . count($keys) . '</caption>';

        $sql =
            'SELECT hasthis, COUNT(id) AS total FROM mdrnzr_value WHERE key_id = ? GROUP BY hasthis ORDER BY client_id ASC';
        $pre = $this->shikakeOji->database->prepare($sql);

        foreach ($keys as $key)
        {
            $out .= '<tr>';
            $out .= '<th data-key-id="' . $key['id'] . '">' . $key['title'] . '</th>';
            $out .= '<td>';
            $item = $pre->execute(array($key['id']));
            if ($item)
            {
                $rows = $pre->fetchAll(PDO::FETCH_ASSOC);
                $list = array();
                foreach ($rows as $row)
                {
                    $list[] = $row['hasthis'] . ' (' . $row['total'] . ')';
                }
                $out .= implode(', ', $list);
            }
            $out .= '</td>';
            $out .= '</tr>';
        }
        $out .= '</table>';

        // get all clients. only the latest for same address and useragent
        $sql = 'SELECT COUNT(id) AS counter, useragent FROM mdrnzr_client GROUP BY useragent ORDER BY counter DESC';
        $run = $this->shikakeOji->database->query($sql);
        $agents = $run->fetchAll(PDO::FETCH_ASSOC);

        $out .= '<ol>';
        foreach ($agents as $row)
        {
            $out .= '<li>' . $row['useragent'] . ' (' . $row['counter'] . ')</li>';
        }
        $out .= '</ol>';

        $out .= $this->createHtmlFooter($data['footer'][$this->shikakeOji->language]);

        return $out;
    }
}
