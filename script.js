let fullScreenInterval = setInterval(() => {
    const webView = document.querySelector("#webview-container");
    const header = document.querySelector("#header");
    const browser = document.querySelector("#browser");
  
    if (webView) {
      clearInterval(fullScreenInterval);
      let fullscreenEnabled;
  
      chrome.storage.local.get("fullScreenModEnabled").then((value) => {
        fullscreenEnabled = value.fullScreenModEnabled || value.fullScreenModEnabled == undefined;
        if (fullscreenEnabled) {
          addFullScreenListener();
        }
      });
  
      vivaldi.tabsPrivate.onKeyboardShortcut.addListener(
        (id, combination) => combination === "Ctrl+Alt+F" && toggleFullScreen()
      );
  
      const style = document.createElement("style");
      style.appendChild(
        document.createTextNode("[hidden] { display: none !important; }")
      );
      document.head.appendChild(style);
  
      const hoverDiv = document.createElement("div");
      hoverDiv.style.height = "9px";
      hoverDiv.style.width = "100vw";
      hoverDiv.style.position = "fixed";
      hoverDiv.style.left = "0";
      hoverDiv.style.top = "0";
      hoverDiv.style.zIndex = 1;
      document.body.insertBefore(hoverDiv, document.body.firstChild);
  
      const leftHoverDiv = document.createElement("div");
      leftHoverDiv.style.height = "100vh";
      leftHoverDiv.style.width = "10px";
      leftHoverDiv.style.position = "fixed";
      leftHoverDiv.style.left = "0";
      leftHoverDiv.style.top = "0";
      leftHoverDiv.style.zIndex = 1;
      document.body.insertBefore(leftHoverDiv, document.body.firstChild);
  
      function toggleFullScreen() {
        fullscreenEnabled = !fullscreenEnabled;
        fullscreenEnabled ? addFullScreenListener() : removeFullScreenListener();
        chrome.storage.local.set({ fullScreenModEnabled: fullscreenEnabled });
      }
  
      function addFullScreenListener() {
        webView.addEventListener("pointerenter", hide);
        hoverDiv.addEventListener("pointerenter", show);
        leftHoverDiv.addEventListener("pointerenter", showTabBar);
        leftHoverDiv.addEventListener("pointerleave", checkIfShouldHideTabBar);
        document.querySelector(".tabbar-wrapper").addEventListener("mouseleave", hideTabBar);
        hide();
      }
  
      function removeFullScreenListener() {
        webView.removeEventListener("pointerenter", hide);
        hoverDiv.removeEventListener("pointerenter", show);
        leftHoverDiv.removeEventListener("pointerenter", showTabBar);
        leftHoverDiv.removeEventListener("pointerleave", checkIfShouldHideTabBar);
        document.querySelector(".tabbar-wrapper").removeEventListener("mouseleave", hideTabBar);
        show();
      }
  
      function hide() {
        header.hidden = true;
        [...document.querySelectorAll(".tabbar-wrapper")].forEach(
          (item) => (item.hidden = true)
        );
      }
  
      function show() {
        header.hidden = false;
        [...document.querySelectorAll(".tabbar-wrapper")].forEach(
          (item) => (item.hidden = false)
        );
        document.querySelector(".mainbar").hidden = false;
        document.querySelector(".bookmark-bar").hidden = false;
        browser.classList.remove("address-top-off");
        browser.classList.add("address-top");
      }
  
      function showTabBar() {
        [...document.querySelectorAll(".tabbar-wrapper")].forEach(
          (item) => (item.hidden = false)
        );
      }
  
      function hideTabBar() {
        [...document.querySelectorAll(".tabbar-wrapper")].forEach(
          (item) => (item.hidden = true)
        );
      }
  
      function checkIfShouldHideTabBar(event) {
        const tabBar = document.querySelector(".tabbar-wrapper");
        if (!tabBar.contains(event.relatedTarget)) {
          hideTabBar();
        }
      }
    }
  }, 1111);