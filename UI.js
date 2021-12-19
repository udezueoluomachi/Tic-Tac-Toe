      function ripple(rippleParentElem, bkgcolor = '#ffffff23') {
        const rippleParent = document.querySelector(`#${rippleParentElem}`);
        const myripple = document.querySelector("#myripple");
        myripple?rippleParent.removeChild(myripple):2*4;
        const rippleElement = document.createElement("div");
        rippleElement.id = "myripple";
        rippleElement.style.width = '50px';
        rippleElement.style.height = "50px";
        rippleElement.style.borderRadius = '100%';
        rippleElement.style.backgroundColor = bkgcolor;
        rippleElement.style.transition = "0.4s";
        rippleElement.style.position = 'absolute';
        let xAxis = event.offsetX;
        let yAxis = event.offsetY;
        rippleElement.style.left = `${xAxis - 25}px`;
        rippleElement.style.top = `${yAxis - 25}px`;
        try {
        rippleParent.appendChild(rippleElement);
        } catch (err) {
          console.log(`UI.js 'Error' \n Element with ${rippleParentElem} id not found`);
        }
        const rippleElement2 = document.createElement("div");
        rippleElement2.style.width = "100%";
        rippleElement2.style.height = "100%";
        rippleElement2.style.position = "absolute";
        rippleElement2.style.top = "0";
        rippleElement2.style.left = "0";
        rippleElement2.style.borderRadius = "inherit";
        rippleElement2.style.backgroundColor = "#ffffff12";
        rippleParent.appendChild(rippleElement2);
        setTimeout(function() {
          rippleElement.style.width = "100%";
          rippleElement.style.height = "100%";
          rippleElement.style.borderRadius = "0%";
          rippleElement.style.top = "0";
          rippleElement.style.left = "0";
        }, 40);
        setTimeout(function() {
          rippleParent.removeChild(rippleElement);
          rippleParent.removeChild(rippleElement2)
        }, 320);
      }