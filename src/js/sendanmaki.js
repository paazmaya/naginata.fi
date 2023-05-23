/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 4.0 Unported
 *          http://creativecommons.org/licenses/by-sa/4.0/
 */

const sendanmaki = {

  /**
   * Image notes for the given key image.
   */
  boguNotes: [
    {
      width: 104,
      height: 126,
      x: 45,
      y: 0,
      note: 'Men'
    },
    {
      width: 58,
      height: 82,
      x: 147,
      y: 235,
      note: 'Kote'
    },
    {
      width: 83,
      height: 118,
      x: 55,
      y: 138,
      note: 'Do'
    },
    {
      width: 137,
      height: 87,
      x: 30,
      y: 246,
      note: 'Tare'
    },
    {
      width: 52,
      height: 133,
      x: 112,
      y: 435,
      note: 'Sune ate'
    },
    {
      width: 31,
      height: 39,
      x: 369,
      y: 236,
      note: 'Kissaki'
    },
    {
      width: 23,
      height: 25,
      x: 13,
      y: 252,
      note: 'Ishizuki'
    },
    {
      width: 48,
      height: 26,
      x: 251,
      y: 307,
      note: 'Sendanmaki'
    },

    {
      width: 39,
      height: 27,
      x: 352,
      y: 279,
      note: 'Monouchi'
    }
  ],

  /**
   * Toggle note class on an element
   * @param {Event} event Mouse over/out event
   * @returns {void}
   */
  onNoteHover: function onNoteHover(event) {
    if (!event.target.matches('.note[rel]')) {
      return;
    }
    if (event.type === 'mouseover' || event.type === 'focus') {
      event.target.classList.add('notehover');
    }
    else {
      event.target.classList.remove('notehover');
    }
  },

  /**
   * Add notes to a chudan kamae bogu image, if available.
   *
   * @param {Array}  items  Items to be created for the given key image
   * @returns {void}
   */
  buildImageNotes: function buildImageNotes(items) {
    const key = '/img/naginata-bogu-chudan-artwork-lecklin.png';

    const images = document.querySelectorAll('img[src="' + key + '"]');
    if (images.length === 0) {
      return;
    }
    const parent = images[0].parentNode;
    parent.classList.add('relative');
    items.forEach(function forItems(data) {
      sendanmaki.createImgNote(data, images[0]);
    });

    document.addEventListener('mouseover', sendanmaki.onNoteHover);
    document.addEventListener('mouseout', sendanmaki.onNoteHover);
    document.addEventListener('focus', sendanmaki.onNoteHover);
    document.addEventListener('blur', sendanmaki.onNoteHover);
  },

  /**
   * Create a note element on a image that has src == data.url
   *
   * @param {{x: number, y: number, width: number, height: number, note: string}} data Data
   *        for the note, such as position, size and text
   * @param {Element} image  Img element
   * @returns {void}
   */
  createImgNote: function createImgNote(data, image) {
    const elements = document.querySelectorAll('span.note[rel="' + data.note + '"]');

    if (image && elements.length === 0) {
      const cont = '<span class="note" rel="' + data.note + '" style="left:' + data.x + 'px; top: ' + data.y + 'px">' +
        '<span class="notearea" style="width:' + data.width + 'px; height: ' + data.height + 'px"></span>' +
        '<span class="notetext">' + data.note + '</span>' +
        '</span>';

      image.insertAdjacentHTML('beforebegin', cont);
    }
  },

  externalClick: function externalClick(event) {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');
    window.open(href, Date.now());
  },

  /**
   * This shall be run on domReady in order to initiate
   * all the handlers needed.
   *
   * @returns {void}
   */
  domReady: function domReady() {
    this.buildImageNotes(this.boguNotes);

    const external = document.querySelectorAll('a[href^="http://"], a[href^="https://"]');
    let result;
    for (let i = 0; i < external.length; ++i) {
      result = external[i];
      result.addEventListener('click', sendanmaki.externalClick);
    }
  }
};

sendanmaki.domReady();
