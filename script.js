document.addEventListener("DOMContentLoaded", () => {
    // Get for All Elements We Need
    let searchInput = document.getElementById("searchInput");
    let searchBtn = document.getElementById("searchBtn");
    let foodInfo = document.getElementById("foodInfo");

    // Button Event
    searchBtn.addEventListener("click", searchFood);

    // searchInput Event 
    searchInput.addEventListener("keydown", (e) => {
        if(e.key === "Enter") {
            searchFood();

        }
    });


    // search Function
    function searchFood() {
        let foodName = searchInput.value.trim();
        if (!foodName) return showError("Please enter the name of the dish.");

        foodInfo.innerHTML = `<div class="loding">Searching...</div>`;

        // Get API
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${foodName}`)
        .then(res => {
            if(!res.ok) {
                throw new Error("This dish is not available.") ;
            }
            return res.json();
        })
        .then(data => { 
            if (!data.meals) {
                showError("This dish is not available."); 
                return;
            }
            displayFoodInfo(data.meals[0]);
        })
        .catch(error => {
            showError(error.message);
        });
    };

    // function to show Recipe information
    function displayFoodInfo(food) {
        let ingredients = [];
        for (let i = 1; i <= 20; i++) {
            let ingredient = food[`strIngredient${i}`]
            let measure = food[`strMeasure${i}`];
            if(ingredient && ingredient.trim() !== "") {
                ingredients.push(`${measure} ${ingredient}`);
            }
        }

        foodInfo.innerHTML = `
            <div class="food-card">
                <img src="${food.strMealThumb}" class="food-img"/>

                <div class="food-details">
                    <h2>${food.strMeal}</h2>
                    <div class="details-item">
                        <span class="detail-label">Cuisine: </span>
                        <span>${food.strArea}.</span>
                    </div>
                    <div class="details-item">
                        <span class="detail-label">Category: </span>
                        <span>${food.strCategory}.</span>
                    </div>
                    <div class="details-item">
                        <span class="detail-label">Ingredients: </span>
                        <ul>
                            ${ingredients.map(item => `<li>${item}</li>`).join("")}
                        <ul/>
                    </div>
                    <div class="details-item">
                        <span class="detail-label">How to prepare the dish: </span>
                        <span>${food.strInstructions}</span>
                    </div>
                    
                </div>
            </div>`
    };

    // Error Function
    function showError(message) {
        foodInfo.innerHTML = `<div class="error-message">${message}</div>`;
    };
});

