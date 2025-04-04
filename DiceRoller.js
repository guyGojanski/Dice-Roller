const rollBtn = document.querySelector('.roll');
const diceContainer = document.querySelector('.dice-container');
const diceCountSelect = document.getElementById('diceCount');

// Function to create dice
const createDice = (num) => {
    diceContainer.innerHTML = ''; // Clear previous dice
    for (let i = 0; i < num; i++) {
        const dice = document.createElement('div');
        dice.className = 'dice';
        ['front', 'back', 'top', 'bottom', 'right', 'left'].forEach(faceName => {
            dice.appendChild(Object.assign(document.createElement('div'), { className: `face ${faceName}` }));
        });
        diceContainer.appendChild(dice);
    }
};

// Function to generate a more natural roll effect
const getRandomRotation = () => {
    return `rotateX(${360 * (Math.floor(Math.random() * 4) + 1)}deg) 
            rotateY(${360 * (Math.floor(Math.random() * 4) + 1)}deg) 
            rotateZ(${90 * (Math.floor(Math.random() * 4))}deg)`;
};

// Function to roll all dice naturally
const rollAllDice = () => {
    rollBtn.disabled = true; // Disable button during animation

    document.querySelectorAll('.dice').forEach(dice => {
        const finalFace = Math.floor(Math.random() * 6) + 1;
        const finalRotations = [
            'rotateX(0deg) rotateY(0deg)',      // 1
            'rotateX(-90deg) rotateY(0deg)',    // 2
            'rotateX(0deg) rotateY(90deg)',     // 3
            'rotateX(0deg) rotateY(-90deg)',    // 4
            'rotateX(90deg) rotateY(0deg)',     // 5
            'rotateX(180deg) rotateY(0deg)'     // 6
        ];

        // Apply random spinning motion
        dice.style.transform = getRandomRotation();
        dice.style.transition = 'transform 1.2s cubic-bezier(0.25, 1, 0.5, 1)';

        // Final orientation after spin
        setTimeout(() => {
            dice.style.transform = finalRotations[finalFace - 1];
        }, 1000);
    });

    setTimeout(() => rollBtn.disabled = false, 1200);
};

// Initialize with 1 die
createDice(1);

// Event listeners
diceCountSelect.addEventListener('change', () => createDice(+diceCountSelect.value));
rollBtn.addEventListener('click', rollAllDice);
