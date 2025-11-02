### Estructura de carpetas del frontend

<details>
  <summary>Ver árbol completo</summary>

```text
├───AMOJOH-POS/
  ├───public/
  │   ├───assets/
  │   │   └───Orders.mp3
  │   ├───_redirects
  │   ├───_headers
  │   ├────sitemap.xml
  │   └────robots.txt
  ├───src/
  │   ├─CSS/
  │   │   ├─ base/
  │   │   │   ├─ var.css
  │   │   │   ├─ reset-base.css
  │   │   │   └─ typography.css
  │   │   ├─ layout/
  │   │   │   ├─ app-shell.css
  │   │   │   ├─ header-footer.css
  │   │   │   ├─ scrollbar.css
  │   │   │   └─ sidebar.css
  │   │   ├─ components/
  │   │   │   ├─ forms.css
  │   │   │   ├─ buttons.css  toast.css
  │   │   │   ├─ tables.css
  │   │   │   ├─ tables.css
  │   │   │   └─ media-tooltips.css
  │   │   ├─ utilities.css
  │   │   └─ main.css
  │   ├───JavaScript/
  │   │   ├───api/
  │   │   │   ├───handle.js
  │   │   │   ├───requestHandler.js
  │   │   │   ├───gets.js
  │   │   │   ├───post.js
  │   │   │   ├───put.js
  │   │   │   └───delete.js
  │   │   ├───routesAndEvents/
  │   │   │   ├───getHandlers.js
  │   │   │   ├───postHandlers.js
  │   │   │   ├───putHandlers.js
  │   │   │   └───deleteAndPutHandlers.js
  │   │   ├───helpers/
  │   │   │   ├───addIngredient.js
  │   │   │   ├───checkAndPlaySound.js
  │   │   │   ├───checkAuth.js
  │   │   │   ├───confirmPassword.js
  │   │   │   ├───delegateEvents.js
  │   │   │   ├───bindCheckboxGroup.js
  │   │   │   ├───generatePDF.js
  │   │   │   ├───inputFile.js
  │   │   │   ├───renderChart.js
  │   │   │   ├───showToast.js
  │   │   │   ├───togglePlateButtons.js
  │   │   │   └───watermark.js
  │   │   ├───logic/
  │   │   │   ├───delete/
  │   │   │   │   └───updateUIAfterDelete.js
  │   │   │   ├───get/
  │   │   │   │   ├───autocomplete.js
  │   │   │   │   ├───orderPainting.js
  │   │   │   │   ├───updateTables.js
  │   │   │   │   ├───createPlateElement.js
  │   │   │   │   ├───paintingPlates.js
  │   │   │   │   ├───renderList.js
  │   │   │   │   └───processPlatesData.js
  │   │   │   ├───post/
  │   │   │   │   ├───createOrderLocal.js
  │   │   │   │   ├───updateUIAfterPost.js
  │   │   │   │   └───renderOrder.js
  │   │   │   └───put/
  │   │   │       ├───paintOrderItem.js
  │   │   │       ├───updateUIAfterPut.js
  │   │   │       ├───createOrderElements.js
  │   │   │       ├───appendOrderElementsToDom.js
  │   │   │       └───createAndConfigureButtons.js
  │   │   ├───storage/
  │   │   │   ├───core/
  │   │   │   │   ├───errors.ts
  │   │   │   │   ├───events.ts
  │   │   │   │   ├───handle.ts
  │   │   │   │   ├───keys.ts
  │   │   │   │   ├───ttl.ts
  │   │   │   │   └───types.ts
  │   │   │   ├───idb/
  │   │   │   │   ├───openDB.ts
  │   │   │   │   └───repo.ts
  │   │   │   └───memory/
  │   │   │   │   ├───adapters.ts
  │   │   │   │   └───store.ts
  │   │   │   └───indexedDB.ts
  │   │   └───app/
  │   │       ├───sseOrders.js
  │   │       ├───sidebar.js
  │   │       ├───showSection.js
  │   │       └───initApp.js
  │   ├───pages/
  │   │   ├───index/
  │   │      └───login.js
  │   │   ├───pos/
  │   │      └───home.js
  │   │   └───register/
  │   │      └───register.js
  │   ├──showDocumentation.js
  │   └───sendMessages.js
  ├───register.html
  ├───architecturePOS.md
  ├───DOC_TECNICO.md
  ├───index.html
  ├────pos.html
  ├────.env
  ├────README.md
  ├────.gitignore
  ├────package.json
  ├────package-lock.json
  └────vite.config.js

```
