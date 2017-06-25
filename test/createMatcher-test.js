import expect from 'expect'
import createMatcher from '../src/core/createMatcher'


let matcher

describe('createMatcher', () => {

    describe('result', () => {
        it('should return a function', () => {
            let matcher = createMatcher([])
            expect(matcher).toBeA('function')
        })
    })

    describe('feature', () => {
        beforeEach(() => {
            matcher = createMatcher([{
                path: '/test/path',
                handler: 'test normal string',
            }, {
                path: '/param/:id',
                handler: 'test string with a id param',
            }, {
                path: '*',
                handler: 'default route',
            }])
        })

        it('should return an object when matched a route', () => {
            let result = matcher('/test/path')

            expect(result).toBeA('object')
            expect(result.path).toEqual('/test/path')
            expect(result.params).toEqual({})
            expect(result.handler).toEqual('test normal string')
            expect(Object.keys(result)).toEqual(['path', 'params', 'handler'])
        })

        it('should return undefined when matched no route', () => {
            let matcher = createMatcher([])
            let result = matcher('/test/path')

            expect(result).toBe(undefined)
        })

        it('should match dynamic path and filled params', () => {
            let result = matcher('/param/404')

            expect(result.path).toEqual('/param/:id')
            expect(result.handler).toEqual('test string with a id param')
            expect(result.params.id).toEqual(404)
        })

        it('should return a default route', () => {
            let result = matcher('/anything')

            expect(result.path).toBe('*')
            expect(result.params).toEqual({
                0: '/anything'
            })
            expect(result.handler).toBe('default route')
        })
    })
})