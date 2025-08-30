
document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const form = document.getElementById('footprintForm');
    const resultsSection = document.getElementById('results');
    const totalFootprintElement = document.getElementById('total-footprint');
    const comparisonElement = document.getElementById('comparison-result');
    const comparisonTextElement = document.getElementById('comparison-text');
    const transportBar = document.getElementById('transport-bar');
    const homeBar = document.getElementById('home-bar');
    const foodBar = document.getElementById('food-bar');
    const transportValue = document.getElementById('transport-value');
    const homeValue = document.getElementById('home-value');
    const foodValue = document.getElementById('food-value');
    const saveResultsButton = document.getElementById('save-results');
    const viewSolutionsButton = document.getElementById('view-solutions');
    
    // Navigation elements
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('main section.card');
    const currentFootprintElement = document.getElementById('current-footprint');
    const biggestImpactElement = document.getElementById('biggest-impact');
    const quickWinsElement = document.getElementById('quick-wins');
    // Add these to your existing DOMContentLoaded function

// Dashboard elements
const dashboardSection = document.getElementById('dashboard');
const dashboardTotalElement = document.getElementById('dashboard-total-footprint');
const dashboardComparisonElement = document.getElementById('dashboard-comparison');
const dashboardTransportBar = document.getElementById('dashboard-transport-bar');
const dashboardHomeBar = document.getElementById('dashboard-home-bar');
const dashboardFoodBar = document.getElementById('dashboard-food-bar');
const dashboardTransportValue = document.getElementById('dashboard-transport-value');
const dashboardHomeValue = document.getElementById('dashboard-home-value');
const dashboardFoodValue = document.getElementById('dashboard-food-value');
const progressPercentElement = document.getElementById('progress-percent');
const reductionProgressBar = document.getElementById('reduction-progress');
const tipsContainer = document.getElementById('tips-container');
const refreshTipsButton = document.getElementById('refresh-tips');
const addGoalButton = document.getElementById('add-goal');
const refreshDashboardButton = document.getElementById('refresh-dashboard');
const exportDashboardButton = document.getElementById('export-dashboard');
const timePeriodSelect = document.getElementById('time-period');

// Chart.js initialization
let footprintChart;

// Sample data for the chart (in a real app, this would come from your database)
const sampleFootprintData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
        label: 'Carbon Footprint (tons)',
        data: [18, 17.5, 17, 16.8, 16.5, 16.2, 16, 15.8, 15.5, 15.3, 15, 14.8],
        borderColor: '#2E7D32',
        backgroundColor: 'rgba(46, 125, 50, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
    }]
};

// Dashboard tips data
const dashboardTips = [
    "Try carpooling twice a week to reduce transportation emissions",
    "Lower your thermostat by 2 degrees in winter months",
    "Switch to LED bulbs in your 5 most-used light fixtures",
    "Have one meat-free day each week",
    "Unplug electronics when not in use to reduce phantom load",
    "Combine errands to reduce the number of car trips",
    "Air dry clothes instead of using the dryer when possible",
    "Install a programmable thermostat to optimize heating/cooling",
    "Buy local produce to reduce food transportation emissions",
    "Reduce shower time by 2 minutes to save water and energy"
];

// Initialize dashboard
function initDashboard() {
    // Load any saved footprint data
    const savedData = localStorage.getItem('carbonFootprintData');
    if (savedData) {
        const data = JSON.parse(savedData);
        updateDashboard(data);
    }
    
    // Initialize chart
    initChart();
    
    // Load tips
    loadTips();
}

// Update dashboard with new data
function updateDashboard(data) {
    // Update main metric
    dashboardTotalElement.textContent = `${data.total.toFixed(1)} tons`;
    
    // Update comparison
    const usAverage = 16;
    const comparison = ((data.total / usAverage) * 100).toFixed(0);
    dashboardComparisonElement.textContent = `${comparison}%`;
    
    // Update breakdown
    const total = data.transport + data.home + data.food;
    if (total > 0) {
        const transportPercent = Math.round((data.transport / total) * 100);
        const homePercent = Math.round((data.home / total) * 100);
        const foodPercent = Math.round((data.food / total) * 100);
        
        dashboardTransportBar.style.width = `${transportPercent}%`;
        dashboardHomeBar.style.width = `${homePercent}%`;
        dashboardFoodBar.style.width = `${foodPercent}%`;
        
        dashboardTransportValue.textContent = `${transportPercent}%`;
        dashboardHomeValue.textContent = `${homePercent}%`;
        dashboardFoodValue.textContent = `${foodPercent}%`;
    }
    
    // Update progress (example - in a real app this would track actual progress)
    const progressPercent = Math.min(Math.round((data.total / usAverage) * 100), 100);
    progressPercentElement.textContent = `${progressPercent}%`;
    reductionProgressBar.style.width = `${progressPercent}%`;
    
    // Update chart with new data
    updateChart(data.total);
}

// Initialize the footprint chart
function initChart() {
    const ctx = document.getElementById('footprintChart').getContext('2d');
    
    footprintChart = new Chart(ctx, {
        type: 'line',
        data: sampleFootprintData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw.toFixed(1)} tons`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Tons CO₂e'
                    }
                }
            }
        }
    });
}

// Update chart with new data point
function updateChart(latestValue) {
    // In a real app, you would add this to your historical data
    // For this example, we'll just update the last point
    const newData = {...sampleFootprintData};
    newData.datasets[0].data[newData.datasets[0].data.length - 1] = latestValue;
    footprintChart.data = newData;
    footprintChart.update();
}

// Load tips into the dashboard
function loadTips() {
    tipsContainer.innerHTML = '';
    
    // Shuffle tips and pick 3
    const shuffled = [...dashboardTips].sort(() => 0.5 - Math.random());
    const selectedTips = shuffled.slice(0, 3);
    
    selectedTips.forEach(tip => {
        const tipElement = document.createElement('div');
        tipElement.className = 'tip-item';
        tipElement.innerHTML = `
            <div class="tip-icon">💡</div>
            <div class="tip-text">${tip}</div>
        `;
        tipsContainer.appendChild(tipElement);
    });
}

// Event listeners for dashboard
refreshTipsButton.addEventListener('click', loadTips);

addGoalButton.addEventListener('click', function() {
    alert('In a complete implementation, this would open a goal creation dialog');
});

refreshDashboardButton.addEventListener('click', function() {
    const savedData = localStorage.getItem('carbonFootprintData');
    if (savedData) {
        const data = JSON.parse(savedData);
        updateDashboard(data);
    }
    loadTips();
});

exportDashboardButton.addEventListener('click', function() {
    alert('Dashboard data exported as PDF (simulated)');
});

timePeriodSelect.addEventListener('change', function() {
    alert(`In a complete implementation, this would load data for ${this.value}`);
});

// Update the showSection function to initialize dashboard when shown
function showSection(sectionId) {
    sections.forEach(section => {
        if (section.id === sectionId) {
            section.classList.remove('hidden');
            
            // Initialize dashboard if showing dashboard
            if (sectionId === 'dashboard') {
                initDashboard();
            }
            
            section.scrollIntoView({ behavior: 'smooth' });
        } else if (section.id !== 'hero') {
            section.classList.add('hidden');
        }
    });
}

// Update form submission to also update dashboard
form.addEventListener('submit', function(e) {
    // ... existing form submission code ...
    
    // After calculating, update the dashboard
    updateDashboard(footprintData);
    
    // ... rest of existing code ...
});
    
    // Store footprint data
    let footprintData = {
        total: 0,
        transport: 0,
        home: 0,
        food: 0
    };

    // Initialize the page
    function initPage() {
        // Hide all sections except hero
        sections.forEach(section => {
            if (section.id !== 'hero') {
                section.classList.add('hidden');
            }
        });
        
        // Set current year for account section
        document.getElementById('join-date').textContent = new Date().getFullYear();
    }

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const carMiles = parseFloat(document.getElementById('car-miles').value) || 0;
        const publicTransport = parseFloat(document.getElementById('public-transport').value) || 0;
        const flights = parseFloat(document.getElementById('flights').value) || 0;
        const electricity = parseFloat(document.getElementById('electricity').value) || 0;
        const naturalGas = parseFloat(document.getElementById('natural-gas').value) || 0;
        const meatConsumption = document.getElementById('meat-consumption').value;
        const shopping = parseFloat(document.getElementById('shopping').value) || 0;
        
        // Calculate footprint
        const transportFootprint = calculateTransportFootprint(carMiles, publicTransport, flights);
        const homeFootprint = calculateHomeFootprint(electricity, naturalGas);
        const foodFootprint = calculateFoodFootprint(meatConsumption, shopping);
        
        const totalFootprint = transportFootprint + homeFootprint + foodFootprint;
        const usAverage = 16; // metric tons CO2e per year (US average)
        
        // Store data
        footprintData = {
            total: totalFootprint,
            transport: transportFootprint,
            home: homeFootprint,
            food: foodFootprint
        };
        
        // Calculate percentages
        let transportPercent = 0, homePercent = 0, foodPercent = 0;
        
        if (totalFootprint > 0) {
            transportPercent = Math.round((transportFootprint / totalFootprint) * 100);
            homePercent = Math.round((homeFootprint / totalFootprint) * 100);
            foodPercent = Math.round((foodFootprint / totalFootprint) * 100);
        }
        
        // Update UI
        totalFootprintElement.textContent = totalFootprint.toFixed(1);
        currentFootprintElement.textContent = totalFootprint.toFixed(1) + " tons";
        
        const comparisonPercent = Math.round((totalFootprint / usAverage) * 100);
        comparisonElement.textContent = `${comparisonPercent}%`;
        
        if (totalFootprint < usAverage) {
            comparisonTextElement.textContent = `better than US average`;
            comparisonElement.style.color = '#4CAF50';
        } else {
            comparisonTextElement.textContent = `of US average`;
            comparisonElement.style.color = '#F44336';
        }
        
        // Animate bars
        setTimeout(() => {
            transportBar.style.width = `${transportPercent}%`;
            homeBar.style.width = `${homePercent}%`;
            foodBar.style.width = `${foodPercent}%`;
            
            transportValue.textContent = `${transportPercent}%`;
            homeValue.textContent = `${homePercent}%`;
            foodValue.textContent = `${foodPercent}%`;
        }, 100);
        
        // Update insights
        updateInsights(transportFootprint, homeFootprint, foodFootprint);
        
        // Show results
        showSection('results');
    });
    
    // Update insights based on footprint data
    function updateInsights(transport, home, food) {
        // Determine biggest impact area
        const biggest = Math.max(transport, home, food);
        let biggestArea = '';
        
        if (biggest === transport) biggestArea = 'Transportation';
        else if (biggest === home) biggestArea = 'Home Energy';
        else biggestArea = 'Food & Shopping';
        
        biggestImpactElement.textContent = `Your ${biggestArea} has the biggest environmental impact`;
        
        // Generate quick wins
        let quickWins = [];
        if (biggestArea === 'Transportation') {
            quickWins = [
                'Carpool to work once a week',
                'Combine errands to reduce trips',
                'Keep tires properly inflated'
            ];
        } else if (biggestArea === 'Home Energy') {
            quickWins = [
                'Lower thermostat by 2°F at night',
                'Unplug devices when not in use',
                'Wash clothes in cold water'
            ];
        } else {
            quickWins = [
                'Try one meat-free day per week',
                'Buy seasonal produce',
                'Reduce food waste by meal planning'
            ];
        }
        
        quickWinsElement.innerHTML = '';
        quickWins.forEach(win => {
            const li = document.createElement('li');
            li.textContent = win;
            quickWinsElement.appendChild(li);
        });
    }
    
    // Show a specific section and hide others
    function showSection(sectionId) {
        sections.forEach(section => {
            if (section.id === sectionId) {
                section.classList.remove('hidden');
                section.scrollIntoView({ behavior: 'smooth' });
            } else if (section.id !== 'hero') {
                section.classList.add('hidden');
            }
        });
    }
    
    // Navigation handling
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href').substring(1);
            
            // Special case for calculator since it's a form
            if (target === 'calculator' && !form.classList.contains('hidden')) {
                return;
            }
            
            showSection(target);
        });
    });
    
    // Button event listeners
    saveResultsButton.addEventListener('click', function() {
        localStorage.setItem('carbonFootprintData', JSON.stringify(footprintData));
        alert('Results saved to your account!');
    });
    
    viewSolutionsButton.addEventListener('click', function() {
        showSection('solutions');
    });
    
    // Load saved data if available
    const savedData = localStorage.getItem('carbonFootprintData');
    if (savedData) {
        footprintData = JSON.parse(savedData);
        currentFootprintElement.textContent = footprintData.total.toFixed(1) + " tons";
    }
    
    // Initialize the page
    initPage();
    
    // Calculation functions (same as before)
    function calculateTransportFootprint(carMiles, publicTransport, flights) {
        const carEmission = 0.404;
        const publicTransportEmission = 0.177;
        const flightEmission = 0.227;
        
        const carTotal = carMiles * carEmission;
        const publicTransportTotal = publicTransport * publicTransportEmission;
        const flightTotal = flights * 500 * flightEmission;
        
        return (carTotal + publicTransportTotal + flightTotal) / 1000;
    }
    
    function calculateHomeFootprint(electricity, naturalGas) {
        const electricityEmission = 0.429;
        const naturalGasEmission = 5.3;
        
        const electricityTotal = electricity * 12 * electricityEmission;
        const naturalGasTotal = naturalGas * 12 * naturalGasEmission;
        
        return (electricityTotal + naturalGasTotal) / 1000;
    }
    
    function calculateFoodFootprint(meatConsumption, shopping) {
        let foodEmission;
        switch(meatConsumption) {
            case 'high': foodEmission = 2.5; break;
            case 'medium': foodEmission = 1.8; break;
            case 'low': foodEmission = 1.2; break;
            default: foodEmission = 1.8;
        }
        
        const shoppingTotal = shopping * 12 * foodEmission;
        return shoppingTotal / 1000;
    }
});