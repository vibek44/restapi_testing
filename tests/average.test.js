const { test, describe }=require('node:test')
const assert=require('node:assert')

const average=require('../utilities/for_testing').average

describe('average', () => {
  test('average of empty array', () => {
    assert.strictEqual( average( [] ), 0)
  })

  test('average of  array with one element zero', () => {
    assert.strictEqual( average( [0] ), 0)
  })

  test('average of  array with many element', () => {
    assert.strictEqual( average( [1,3,5,6,8,1] ), 4)
  })
})

