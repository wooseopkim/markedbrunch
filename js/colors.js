;(w => {
  const palette = [
    { white: 'ffffff' },
    { gray: '959595' },
    { black: '333333' },
    { yellow: 'f4c216' },
    { green: '16b06d' },
    { orange: 'f6665b' },
    { azure: '00c3bd' },
    { pink: 'ec4c6a' },
    { blue: '2e84b6' },
    { purple: '5c5cb2' },
  ]
  const alias = {
    gray: ['grey']
  }
  for (original in alias) {
    alias[original].forEach(name => {
      palette.push({ [name]: Object.values(palette.find(x => Object.keys(x)[0] === original ))[0] })
    })
  }
  const out = {}
  palette.forEach((v, i) => {
    const name = Object.keys(v)[0]
    const code = v[name]

    out[i] = out[name] = code
  })
  const color = Object.freeze(out)

  const map = {
    comment: color.gray,
    prolog: color.gray,
    doctype: color.gray,
    cdata: color.gray,
    namespace: color.gray,

    punctuation: color.black,

    property: color.pink,
    tag: color.pink,
    boolean: color.pink,
    number: color.pink,
    constant: color.pink,
    symbol: color.pink,
    deleted: color.pink,

    selector: color.green,
    'attr-name': color.green,
    string: color.green,
    char: color.green,
    builtin: color.green,
    inserted: color.green,

    operator: color.purple,
    entity: color.purple,
    url: color.purple,

    atrule: color.azure,
    'attr-value': color.azure,
    keyword: color.azure,

    'function': color.blue,

    regex: color.yellow,
    important: color.yellow,
    variable: color.yellow,
  }
  const typeColor = type => {
    const code = map[type]
    return code ? '#' + code : ''
  }

  w.typeColor = typeColor
  w.color = color
})(this);