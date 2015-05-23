
describe("set", function () {
    var uniqueClass;
    var testContainerId;
    var paragraphClass;

    beforeEach(function () {
        testContainerId = 'test' + guid();
        paragraphClass = 'test-p-' + testContainerId;
        uniqueClass = '_' + guid();
        document.body.innerHTML += '<div id="' + testContainerId + '">' +
                                      '<div ></div>' +
                                      '<p class="' + paragraphClass + '">Paragraph One</p>' +
                                      '<p>Paragraph Two</p>' +
                                   '</div>';
    });

    afterEach(function () {
        var container = window[testContainerId];
        if (container) {
            container.parentNode.removeChild(container);
        }
    });

    it("set adds class", function () {
        expect(set('.' + uniqueClass).length).toEqual(0);
        set('#' + testContainerId).addClass(uniqueClass);
        expect(set('.' + uniqueClass).length).toEqual(1);
    });
    
   it("set removes class", function () {
        expect(set('.' + paragraphClass).length).toEqual(1);
        set('.' + paragraphClass).removeClass(paragraphClass);
        expect(set('.' + paragraphClass).length).toEqual(0);
    });
    
   describe("set appends elements", function () {
       it("elements as string", function () {
           expect(set('.' + uniqueClass).length).toEqual(0);
           set('#' + testContainerId).append('<div class="' + uniqueClass + '"></div>');
           expect(set('.' + uniqueClass).length).toEqual(1);
       });

       it("elements as set", function () {
           var $p = set('#' + testContainerId + ' p');
           set('#' + testContainerId + ' > div').append($p);
           expect(set('#' + testContainerId + ' > div > p').length).toEqual(2);
       });

       it("elemenents as element", function () {
           var p = set('#' + testContainerId + ' p')[0];
           set('#' + testContainerId + ' > div').append(p);
           expect(set('#' + testContainerId + ' > div > p').length).toEqual(1);
       });
   });
    
   it("set removed element", function () {
       expect(set('.' + paragraphClass).length).toEqual(1);
       set('.' + paragraphClass).remove();
       expect(set('.' + paragraphClass).length).toEqual(0);
   });
    
   it("set iterates on elements", function () {
       var counter = 0;
       set('#' + testContainerId + ' > p').each(function () {
           counter++;
       });
       expect(counter).toEqual(2);
   });
   
   function guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

});
