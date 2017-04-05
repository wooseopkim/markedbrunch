;(w => {

  console.log('Testing MDB... :)')

  // Dependencies
  const marked = w.marked
  const prism = w.Prism
  const typeColor = w.typeColor

  const $ = q => document.getElementsByClassName(q)[0]
  const $$ = document.getElementsByClassName.bind(document)
  const foreach = (xs, f) => Array.prototype.forEach.call(xs, f)

  // Populate UI
  const saveButton = $('#save')
  const compileButton = saveButton.cloneNode()
  compileButton.className = '#compile'
  compileButton.textContent = '변환'
  compileButton.style.cssText = window.getComputedStyle(saveButton).cssText
  saveButton.parentNode.insertBefore(compileButton, saveButton)

  // Set up the highlighter
  const render = tokens => tokens.map(function tokenToHTML(token) {
    if (typeof token === 'string') return token
    if (Array.isArray(token) && token.length === 1) return token[0]
    return `<span style="color:${typeColor(token.type)};">${tokenToHTML(token.content)}</span>`
  }).join('')
  marked.defaults.highlight = (text, lang) => {
    return render(prism.tokenize(text, prism.languages[lang] || prism.languages.clike))
  }

  // Register compile event
  const foot = '\n<blockquote class="blockquote_type3 wrap_item item_type_text" data-app="{&quot;type&quot;:&quot;quotation&quot;,&quot;kind&quot;:&quot;box&quot;,&quot;data&quot;:[{&quot;type&quot;:&quot;text&quot;,&quot;text&quot;:&quot;이 글은 &quot;},{&quot;type&quot;:&quot;anchor&quot;,&quot;url&quot;:&quot;https://chrome.google.com/webstore/detail/markedbrunch/kcaapljhfpbaakjodmebfhgbjdbifekh&quot;,&quot;data&quot;:[{&quot;type&quot;:&quot;text&quot;,&quot;text&quot;:&quot;MarkedBrunch&quot;}],&quot;target&quot;:&quot;_blank&quot;},{&quot;type&quot;:&quot;text&quot;,&quot;text&quot;:&quot;를 이용해 작성되었습니다.&quot;}]}">이 글은 <a class="link" target="_blank" href="https://chrome.google.com/webstore/detail/markedbrunch/kcaapljhfpbaakjodmebfhgbjdbifekh">MarkedBrunch</a>를 이용해 작성되었습니다.</blockquote>'
  const compile = () => {
    const wrapBody = $('wrap_body')
    wrapBody.innerHTML = marked(wrapBody.innerText + foot)
  }
  const displayHack = () => {
    const codes = $$('item_type_text code')
    const codeStyle = 'white-space: pre-wrap;'
    foreach(codes, code => {code.style = codeStyle, code.className = code.className.replace('code', '')})

    const hrs = $$('item_type_hr')
    const hrStyle = 'width: 940px; margin-left: -120px;'
    foreach(hrs, hr => hr.style = hrStyle)

    const imgs = $$('item_type_img')
    const imgStyle = 'width: 940px; margin-left: -120px; display: block;'
    foreach(imgs, img => img.style = imgStyle)
  }
  const replaceImages = () => {
    const imgs = $$('item_type_img')
    foreach(imgs, replaceSrc)
  }
  compileButton.addEventListener('click', e => {
    compile()
    displayHack()
    replaceImages()
  }, false)

  // Ensure all image hrefs are on Brunch server
  const key = '92b31102528511e1a2ec4040d3dc5c07'
  const proxy = url => `https://i.embed.ly/1/display/?key=${key}&url=${encodeURIComponent(url)}`
  function replaceSrc (wrapper) {
    const img = wrapper.querySelector('img')
    const original = img.src

    const request = new XMLHttpRequest()
    request.responseType = 'blob'

    request.onload = onRequestLoad
    request.onerror = onRequestError
    request.open('GET', proxy(original))
    request.send()

    function onRequestLoad () {
      const formData = new FormData()
      formData.append('type', 'image')
      formData.append('file', request.response)

      const post = new XMLHttpRequest()
      post.withCredentials = true
      
      post.onload = onPostLoad
      post.open('POST', 'https://api.brunch.co.kr/v1/upload', true)
      post.send(formData)

      function onPostLoad () {
        const res = JSON.parse(post.response)
        switch (res.code) {
          case 200:
            img.src = res && res.data && res.data.url
            wrapper.setAttribute('data-app', wrapper.getAttribute('data-app').replace(original, img.src))
            break;
          default:
            renderError('서버 오류입니다. 잠시 후에 다시 시도하거나 브런치의 기본 기능을 이용해 주세요.')
            break;
        }
      }
    }

    function onRequestError () {
      renderError(proxy ? 
          '서버 오류입니다. 잠시 후에 다시 시도하거나 브런치의 기본 기능을 이용해 주세요.' :
          '이용할 수 없는 이미지입니다. 서버가 https를 지원하는지 확인한 후, 다시 시도해 주세요. 또는 브런치의 기본 기능을 이용해 업로드해 주세요.')
    }

    function renderError (msg) {
        const caption = wrapper.querySelector('.text_caption')
        const frame = wrapper.querySelector('.wrap_img_float')
        img.style.opacity = `${.5}`
        caption.innerHTML = msg || '알 수 없는 오류가 발생했습니다. 브런치의 기본 기능을 이용해 업로드해 주세요.'
        caption.style['font-size'] = 'large'
        caption.style['font-weight'] = 'bold'
        frame.style.background = 'red'
        caption.style.color = 'white'
    }

  }

})(this);