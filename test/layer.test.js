const ext = require('../src/lib')
const data = require('./sample-data')
const s = require('string')
const { Context, Layer, Project } = require('@zeplin/extension-model')

function ExpectEmptyTest(context, layer) {
  let css = ext.layer(context, layer)

  expect(css.code).toBe('<div class=""></div>')
}

let tests = {
  SampleScreen(context, layer) {
    let css = ext.layer(context, layer)
  
    expect(css.code).toBe('<div class="max-w-xs min-h-lg"></div>')
  },

  TextLayerWithMultipleStyles(context, layer) {
    let css = ext.layer(context, layer)

    expect(css.code).toBe(`<p class="text-xl font-medium">Type</p>
<p class="text-xl text-green">something</p>
<p class="sample-text-style-with-color uppercase">RED</p>`)
  },

  TextLayer(context, layer) {
    let css = ext.layer(context, layer)

    expect(css.code).toBe(`<p class="sample-text-style truncate">Type something...</p>`)
  },

  LayerWithBlur(context, layer) {
    let css = ext.layer(context, layer)

    expect(css.code).toBe(`<div class="max-w-xs"></div>`)
  },

  ExportableLayer(context, layer) {
    let css = ext.layer(context, layer)

    expect(css.code).toBe(`<div class="bg-yellow max-w-xs"></div>`)
  },

  LayerWithBorderRadius(context, layer) {
    let css = ext.layer(context, layer)

    expect(css.code).toBe(`<div class="rounded-lg bg-red max-w-xs"></div>`)
  },

  RotatedLayer(context, layer) {
    let css = ext.layer(context, layer)

    expect(css.code).toBe(`<div class="bg-green max-w-xs"></div>`)
  },

  TransparentLayerWithBlendMode(context, layer) {
    let css = ext.layer(context, layer)

    expect(css.code).toBe(`<div class="opacity-25 bg-green max-w-xs"></div>`)
  },

  LayerWithShadow(context, layer) {
    let css = ext.layer(context, layer)

    expect(css.code).toBe(`<div class="shadow max-w-xs"></div>`)
  },

  LayerWithGradientFill(context, layer) {
    let css = ext.layer(context, layer)

    expect(css.code).toBe(`<div class="max-w-xs"></div>`)
  },

  LayerWithFill(context, layer) {
    let css = ext.layer(context, layer)

    expect(css.code).toBe(`<div class="bg-blue max-w-xs"></div>`)
  },

  LayerWithGradientBorder(context, layer) {
    let css = ext.layer(context, layer)

    expect(css.code).toBe(`<div class="border-4 max-w-xs"></div>`)
  },
  
  LayerWithBorder(context, layer) {
    let css = ext.layer(context, layer)

    expect(css.code).toBe(`<div class="border-2 border-green max-w-xs"></div>`)
  },
}

describe('Sample Data Tests', () => {
  /**
   * Setup our project
   */
  let tailwind = require('../src/tailwind-config.json')
  tailwind.screens = { }
  let project = new Project(data.project)
  let context = new Context({ project, options: { font: 'SFProText', color: 'black', tailwind: JSON.stringify(tailwind) }})

  /**
   * Runs through each sample layer and calls the function to test it
   */
  data.layers.forEach(layer => {
    let fn = s(layer.name).camelize().s
    
    tests[fn] ? test(layer.name, () => tests[fn](context, new Layer(layer))) : xtest(layer.name)
  })
})

test('outputs responsive classes as well for shape elements', () => {
  // Arrange.
  let tailwind = require('../src/tailwind-config.json')
  tailwind.screens = { "sm": "576px" }
  let project = new Project(data.project)
  let context = new Context({ project, options: { tailwind: JSON.stringify(tailwind) }})

  // Act.
  let layer = new Layer({ type: "shape", rect: { width: 320, height: 768 }, borders: [], fills: [], shadows: [] })
  let css = ext.layer(context, layer)

  // Assert.
  expect(css.code).toContain('sm:')
})