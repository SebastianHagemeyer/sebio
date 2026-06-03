const drops = document.querySelectorAll('.drop');
const draggablesContainer = document.getElementById('draggables');
let gameover = false;

/*const scenarios = {
    highGlucose: {
        Stimulus: "Rise in blood glucose",
        Receptor: "Beta cells in pancreas",
        Modulator: "Pancreas",
        Effector: "Liver cells",
        Response: "Glucose stored as glycogen"
    }
}*/
const scenarios = {
  highGlucose: {
    correct: {
      Stimulus: "Rise in blood glucose",
      Receptor: "Beta cells in pancreas",
      Modulator: "Pancreas",
      Effector: "Liver cells",
      Response: "Glucose stored as glycogen"
    },
    decoys: [
      "Drop in blood glucose",
      "Alpha cells in pancreas",
      "Sweat glands and skin arterioles",
      "Vasoconstriction",
      "Oxytocin surge",
      "ADH secretion"
    ]
  },
  lowGlucose: {
    correct: {
      Stimulus: "Drop in blood glucose",
      Receptor: "Alpha cells in pancreas",
      Modulator: "Pancreas",
      Effector: "Liver cells",
      Response: "Release of glucose into blood"
    },
    decoys: [
      "Rise in blood glucose",
      "Beta cells in pancreas",
      "Sweat glands",
      "Shivering",
      "Thyroid hormone release",
      "Stretch receptors in cervix"
    ]
  },
  highTemp: {
    correct: {
      Stimulus: "Increase in body temperature",
      Receptor: "Thermoreceptors in skin and brain",
      Modulator: "Hypothalamus",
      Effector: "Sweat glands and skin arterioles",
      Response: "Sweating and vasodilation"
    },
    decoys: [
      "Drop in blood glucose",
      "Pituitary gland releases oxytocin",
      "Alpha cells activated",
      "Shivering and vasoconstriction",
      "Glucose stored as glycogen",
      "Insulin release"
    ]
  },
  lowTemp: {
    correct: {
      Stimulus: "Decrease in body temperature",
      Receptor: "Thermoreceptors in skin and brain",
      Modulator: "Hypothalamus",
      Effector: "Skeletal muscles and skin arterioles",
      Response: "Shivering and vasoconstriction"
    },
    decoys: [
      "Sweating and vasodilation",
      "Beta cells in pancreas",
      "Oxytocin surge",
      "Liver stores glycogen",
      "Increased heart rate",
      "Cervix pressure"
    ]
  },
  childbirth: {
    correct: {
      Stimulus: "Pressure on cervix",
      Receptor: "Stretch receptors in cervix",
      Modulator: "Hypothalamus",
      Effector: "Pituitary gland releases oxytocin",
      Response: "Stronger uterine contractions"
    },
    decoys: [
      "Glucose stored as glycogen",
      "Thermoreceptors in brain",
      "Shivering",
      "Vasodilation",
      "Sweat glands",
      "Pancreas"
    ]
  },
  adhResponse: {
  correct: {
    Stimulus: "Increase in blood osmolarity",
    Receptor: "Osmoreceptors in hypothalamus",
    Modulator: "Hypothalamus and posterior pituitary",
    Effector: "Kidney collecting ducts",
    Response: "More water reabsorbed, concentrated urine"
  },
  decoys: [
    "Drop in blood glucose",
    "Alpha cells in pancreas",
    "Liver cells store glycogen",
    "Sweat glands increase output",
    "Vasoconstriction in skin arterioles",
    "Release of insulin",
    "Thyroxine release"
  ]
}


};

function loadScenario() {
  const selected = document.getElementById('scenario').value;
  const set = scenarios[selected];

  // Clear previous draggables and dropzones
  draggablesContainer.innerHTML = "";
  drops.forEach(drop => {
    drop.textContent = "";
    drop.removeAttribute("data-drop-type");
    drop.classList.remove("correct", "incorrect");
  });

  // Combine correct entries and decoys
  const correctEntries = Object.entries(set.correct).map(([type, label]) => ({
    type,
    label
  }));

  const decoyEntries = set.decoys.map(label => ({
    type: "Decoy",
    label
  }));

  const allItems = correctEntries.concat(decoyEntries);
  shuffleArray(allItems);

  // Generate draggable elements
  allItems.forEach(item => {
    const div = document.createElement('div');
    div.className = 'drag';
    div.setAttribute('draggable', 'true');
    div.setAttribute('data-type', item.type);
    div.textContent = item.label;
    draggablesContainer.appendChild(div);
  });

  // Enable drag-drop functionality
  enableDragging();

  // Store current scenario’s correct mapping for validation
  currentScenario = set.correct;
}

function enableDragging() {


  

  const drags = document.querySelectorAll('.drag');
drags.forEach(originalDrag => {
    const drag = originalDrag.cloneNode(true); // Remove old listeners
    originalDrag.replaceWith(drag); // Replace element

    drag.addEventListener('dragstart', e => {
        e.dataTransfer.setData('type', drag.dataset.type);
        e.dataTransfer.setData('label', drag.textContent);
    });

    // Click to place in first empty drop zone
    drag.addEventListener('click', () => {
        for (let drop of drops) {
            if (!drop.textContent) {
                drop.textContent = drag.textContent;
                drop.setAttribute('data-drop-type', drag.dataset.type);
                drag.remove();
                break;
            }
        }
    });
});


  drops.forEach(drop => {
    drop.addEventListener('dragover', e => e.preventDefault());
    drop.addEventListener('drop', e => {
    e.preventDefault();
    const label = e.dataTransfer.getData('label');
    const type = e.dataTransfer.getData('type');

    // If there's already an item in the drop, return it to draggables
    const existingLabel = drop.textContent;
    const existingType = drop.getAttribute('data-drop-type');

    if (existingLabel && existingType) {
        const returnDiv = document.createElement('div');
        returnDiv.className = 'drag';
        returnDiv.setAttribute('draggable', 'true');
        returnDiv.setAttribute('data-type', existingType);
        returnDiv.textContent = existingLabel;
        draggablesContainer.appendChild(returnDiv);
        enableDragging(); // re-enable drag for the new element
    }

    // Place the new item
    drop.textContent = label;
    drop.setAttribute('data-drop-type', type);

    // Remove the dragged item from the draggable container
    const dragElements = document.querySelectorAll('.drag');
    dragElements.forEach(drag => {
        if (drag.textContent === label && drag.dataset.type === type) {
            drag.remove();
        }
    });
});


drop.addEventListener('click', () => {
    const existingLabel = drop.textContent;
    const existingType = drop.getAttribute('data-drop-type');

    if (existingLabel && existingType) {
        const returnDiv = document.createElement('div');
        returnDiv.className = 'drag';
        returnDiv.setAttribute('draggable', 'true');
        returnDiv.setAttribute('data-type', existingType);
        returnDiv.textContent = existingLabel;
        draggablesContainer.appendChild(returnDiv);
        enableDragging(); // Re-enable dragging for the new item

        drop.textContent = "";
        drop.removeAttribute("data-drop-type");
        drop.classList.remove("correct", "incorrect");
    }
});

  });
}

function checkAnswers() {
  if (gameover) {
    return
  }
  const selected = document.getElementById('scenario').value;
  const correctSet = scenarios[selected];
  let correct = true;

  drops.forEach(drop => {
    const expected = drop.getAttribute('data-type');
    const actual = drop.getAttribute('data-drop-type');
    if (expected !== actual) correct = false;
  });

  const feedback = document.getElementById('feedback');
  feedback.textContent = correct ? "✅ All correct! Well done." : "❌ Some are incorrect. Try again!";
  feedback.style.color = correct ? "green" : "red";


  if (correct) {
    const modal = document.getElementById("correctModal");
modal.style.display = "flex";

// Auto-close after 1.5 seconds
setTimeout(() => {
  modal.style.display = "none";
}, 1500);


    happyBladders += 1;
    updateHappyBladders();

    feedback.textContent = "✅ All correct! Well done.";
    feedback.style.color = "green";

    const select = document.getElementById("scenario");
    const selectedValue = select.value;

    // Remove from dropdown
    for (let i = 0; i < select.options.length; i++) {
      if (select.options[i].value === selectedValue) {
        select.remove(i);
        break;
      }
    }

    // Load next scenario if any
    if (select.options.length > 0) {
      select.selectedIndex = 0;
      loadScenario();
    } else {

      feedback.textContent += " 🎉 All scenarios completed!";
      gameover = true;
    }


  }


}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// Load default on start
window.onload = loadScenario;

let happyBladders = 0;
let maxHappyBladders = 5;

function updateHappyBladders() {
  const container = document.getElementById("happyBladderCounter");
  let icons = "";

  for (let i = 0; i < happyBladders; i++) {
    icons += "😊 "; // happy bladder emoji or use a custom icon here
  }
  // Fill remaining spots with empty bladder (optional)
  for (let i = happyBladders; i < maxHappyBladders; i++) {
    icons += "⚪ "; // empty circle or different icon
  }

  container.textContent = icons.trim();

  if (happyBladders >= maxHappyBladders) {
    // Optional: show a win message or trigger something
    container.textContent += " 🎉 Goal reached!";
  }
}