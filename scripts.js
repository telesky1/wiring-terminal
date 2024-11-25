
let lockedImages = [];

async function loadTableData() {
  const response = await fetch('terminal_data.csv');
  const data = await response.text();
  const rows = data.split('\n').slice(1); // Skip header row

  let tableBody = document.querySelector("tbody");
  tableBody.innerHTML = "";

  rows.forEach((row, index) => {
    const columns = row.split(',');
    if (columns.length >= 3) {
      let tr = document.createElement("tr");

      let lockTd = document.createElement("td");
      lockTd.className = "lock-cell";
      let lockCheckbox = document.createElement("input");
      lockCheckbox.type = "checkbox";
      lockCheckbox.className = "lock-checkbox";
      lockCheckbox.addEventListener('change', (e) => {
        if (e.target.checked) {
          if (lockedImages.length < 2) {
            lockedImages.push(columns[0].trim());
            updateLockedImages();
          } else {
            e.target.checked = false;
          }
        } else {
          lockedImages = lockedImages.filter(item => item !== columns[0].trim());
          updateLockedImages();
        }
      });
      lockTd.appendChild(lockCheckbox);
      lockTd.appendChild(document.createTextNode(" "));
      lockTd.addEventListener('click', (e) => {
        if (e.target !== lockCheckbox) {
          lockCheckbox.checked = !lockCheckbox.checked;
          lockCheckbox.dispatchEvent(new Event('change'));
        }
      });

      let indexTd = document.createElement("td");
      indexTd.className = "index";
      indexTd.textContent = index + 1;

      let modelTd = document.createElement("td");
      modelTd.className = "model";
      let link = document.createElement("a");
      link.href = columns[2].trim();
      link.textContent = columns[0].trim();
      link.target = "_blank"; // 在新标签页打开链接
      modelTd.appendChild(link);

      let spacingTd = document.createElement("td");
      spacingTd.className = "spacing";
      spacingTd.textContent = columns[1].trim();

      tr.appendChild(lockTd);
      tr.appendChild(indexTd);
      tr.appendChild(modelTd);
      tr.appendChild(spacingTd);

      // Mouseover and mouseout events for image previews
      tr.addEventListener('mouseover', () => {
        if (lockedImages.length < 1) {
          const imagePreview = document.getElementById('image-preview');
          imagePreview.style.display = "flex";
          imagePreview.innerHTML = `<img src='images/${columns[0].trim()}.jpg' alt='${columns[0].trim()} 规格图片'>`;
        } else if (lockedImages.length < 2) {
          const imagePreview2 = document.getElementById('image-preview-2');
          imagePreview2.style.display = "flex";
          imagePreview2.innerHTML = `<img src='images/${columns[0].trim()}.jpg' alt='${columns[0].trim()} 规格图片'>`;
        }
      });

      tr.addEventListener('mouseout', () => {
        if (lockedImages.length < 1) {
          const imagePreview = document.getElementById('image-preview');
          imagePreview.style.display = "none";
          imagePreview.innerHTML = "";
        } else if (lockedImages.length < 2) {
          const imagePreview2 = document.getElementById('image-preview-2');
          imagePreview2.style.display = "none";
          imagePreview2.innerHTML = "";
        }
      });

      tableBody.appendChild(tr);
    }
  });
}


function updateLockedImages() {
  const imagePreview = document.getElementById('image-preview');
  const imagePreview2 = document.getElementById('image-preview-2');
  if (lockedImages[0]) {
    imagePreview.style.display = "flex";
    imagePreview.innerHTML = `<img src='images/${lockedImages[0]}.jpg' alt='${lockedImages[0]} 规格图片'>`;
  } else {
    imagePreview.style.display = "none";
    imagePreview.innerHTML = "";
  }
  if (lockedImages[1]) {
    imagePreview2.style.display = "flex";
    imagePreview2.innerHTML = `<img src='images/${lockedImages[1]}.jpg' alt='${lockedImages[1]} 规格图片'>`;
  } else {
    imagePreview2.style.display = "none";
    imagePreview2.innerHTML = "";
  }
}

function filterTable() {
  let spacingFilter = document.getElementById("spacing-filter").value.trim();
  let modelFilter = document.getElementById("model-filter").value.trim().toUpperCase();
  let rows = document.querySelectorAll("tbody tr");

  let filteredCount = 0;

  rows.forEach((row, index) => {
    let spacingCell = row.querySelector(".spacing").textContent.trim();
    let modelCell = row.querySelector(".model").textContent.trim().toUpperCase();

    let spacingNormalized = parseFloat(spacingCell).toFixed(2);
    let spacingFilterNormalized = spacingFilter ? parseFloat(spacingFilter).toFixed(2) : "";

    let spacingMatch = spacingFilter === "" || spacingNormalized.startsWith(spacingFilterNormalized) || spacingCell.startsWith(spacingFilter);
    let modelMatch = modelFilter === "" || modelCell.includes(modelFilter);

    if (spacingMatch && modelMatch) {
      row.style.display = "table-row";
      row.querySelector(".index").textContent = ++filteredCount;
    } else {
      row.style.display = "none";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadTableData();
});