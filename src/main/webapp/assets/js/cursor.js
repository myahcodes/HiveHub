//document.addEventListener('DOMContentLoaded', function () {
//    Cursorjs.create({
//        // Your default cursor image
//        innerHTML: '<svg width="32" height="32" viewBox="0 0 32 32"> <use href="webapp/assets/img/icons/cursors/cursors.svg#honeycursor" ></use></svg >',

//        // Hover effects for interactive elements
//        hover: [
//            {
//                // All interactive elements
//                selectors: 'a, button, [role="button"], input[type="submit"], input[type="button"]',
//                // Change to pointer image on hover
//                className: 'cursor-pointer-hover',
//                cursor: 'none'
//            },
//            {
//                // Text input fields
//                selectors: 'input[type="text"], input[type="email"], input[type="password"], textarea',
//                className: 'cursor-text-hover',
//                cursor: 'none'
//            }
//        ],
//        speed: 0.2,

//        // Cursor wrapper styling (the container that follows your mouse)
//        wrapperCSS: {
//            pointerEvents: 'none',
//            zIndex: '9999',
//            position: 'fixed',
//            top: 0,
//            left: 0,
//        },

//        // Your cursor element styling
//        cursorCSS: {
//            position: 'absolute',
//            transform: 'translate(-50%, -50%)',
//            transition: 'all 0.2s ease'
//        }
//    });
//});