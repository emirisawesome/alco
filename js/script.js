
'use strict'

const API = 'https://www.thecocktaildb.com/api/json/v1/1/'
const SEARCH = 'search.php?s='
const SEARCH_I = 'search.php?i='
const GET_ALL_COCKTAILS = `${API}filter.php?c=Cocktail`
const FILTER_BY_ALCOHOLIC = 'filter.php?a='
const LOOKUP_COCKTAIL_DETAIL = 'lookup.php?i='



const body = document.body

const searchInput = document.querySelector('.searchInput')
const alcoholicFilter = document.querySelector('.alcoholicFilter')
const output = document.querySelector('.output')


const displayCocktails = async (data) => {
    output.innerHTML = ''
    console.log(data);
    data.forEach(element => {
        let card = document.createElement('article')
        card.className = 'card'
        card.addEventListener('click', () => {
            getLookupCocktail(element)
        })
        output.append(card)

        let cardImg = document.createElement('img')
        cardImg.className = 'cardImg'
        cardImg.src = element.strDrinkThumb
        card.append(cardImg)

        let cardTitle = document.createElement('h2')
        cardTitle.className = 'cardTitle'
        cardTitle.innerHTML = element.strDrink
        card.append(cardTitle)


    });


}


const displayLookup = async (data) => {
    output.innerHTML = ''

    let card = document.createElement('article')
    card.className = 'card'
    output.append(card)

    let cardImg = document.createElement('img')
    cardImg.className = 'cardImg'
    cardImg.src = data.strDrinkThumb
    card.append(cardImg)

    let cardTitle = document.createElement('h2')
    cardTitle.className = 'cardTitle'
    cardTitle.innerHTML = data.strDrink
    card.append(cardTitle)

    let AlcoholicStatus
    (data.strAlcoholic == 'Alcoholic') ? AlcoholicStatus = 'Алкогольный' : AlcoholicStatus = 'Без алкогольный'

    let cocktailtype = document.createElement('h4')
    cocktailtype.className = 'cocktailtype'
    cocktailtype.innerHTML = `Тип: ${AlcoholicStatus}`
    card.append(cocktailtype)

    let cocktailGlass = document.createElement('h4')
    cocktailGlass.className = 'cocktailGlass'
    cocktailGlass.innerHTML = `Посуда: ${data.strGlass}`
    card.append(cocktailGlass)

    let cocktailInstructions = document.createElement('div')
    cocktailInstructions.className = 'cocktailInstructions'
    cocktailInstructions.innerHTML = `<h4>Инструкция:</h4> <p class='cocktailInstructionsPor'>${data.strInstructions}</p>`
    card.append(cocktailInstructions)

    let cocktailIngredients = document.createElement('ul')
    cocktailIngredients.className = 'cocktailIngredients'
    card.append(cocktailIngredients)


    for (const key in data) {
        if (key.includes('strIngredient') && data[key] != null && data[key] != "") {
            let ingredient = document.createElement('li')
            ingredient.innerHTML = data[key]
            ingredient.addEventListener('click', () => {
                console.log(data[key]);
                getIngridientByName(data[key])
            })
            cocktailIngredients.append(ingredient)
        }
    }

    const ingridientCard = document.createElement('div')
    ingridientCard.className = 'ingridientCard'
    card.append(ingridientCard)


    let backButton = document.createElement('button')
    backButton.innerHTML = '< Назад'
    backButton.className = 'backButton'
    card.append(backButton)
    backButton.addEventListener('click', getAllCocktails)

}

const displayLookupIngridient = (data) => {

    const ingridientCard = document.querySelector('.ingridientCard')

    const ingridientCardInner = document.createElement('div')
    ingridientCardInner.className = 'ingridientCard'
    ingridientCard.innerHTML = ingridientCardInner
    ingridientCard.replaceWith(ingridientCardInner)

    const ingridientTitle = document.createElement('h3')
    ingridientTitle.className = 'ingridientTitle'
    ingridientTitle.innerHTML = data.strIngredient
    ingridientCardInner.append(ingridientTitle)

    const ingridientABV = document.createElement('p')
    ingridientABV.className = 'ingridientABV'
    ingridientABV.innerHTML = `Градус: ${data.strABV ? data.strABV + '%' : ' ХЗ'}`
    ingridientCardInner.append(ingridientABV)

    const ingridientDescription = document.createElement('p')
    ingridientDescription.className = 'ingridientDescription'
    ingridientDescription.innerHTML = `Описание:${data.strDescription ? data.strDescription : ' нету млять'}`
    ingridientCardInner.append(ingridientDescription)

}



const getIngridientByName = async (name) => {
    const request = await fetch(`${API}${SEARCH_I}${name}`)
    const response = await request.json()
    console.log(response.ingredients[0]);

    displayLookupIngridient(response.ingredients[0])
}

const getAllCocktails = async () => {
    const request = await fetch(GET_ALL_COCKTAILS)
    const response = await request.json()

    displayCocktails(response.drinks)
}




const getCocktailByName = async () => {
    console.log('getCocktailByName');

    const request = await fetch(`${API}${SEARCH}${searchInput.value}`)
    const response = await request.json()

    displayCocktails(response.drinks)

}


const getAlcoholicFilter = async (type) => {
    const request = await fetch(`${API}${FILTER_BY_ALCOHOLIC}${type}`)
    const response = await request.json()
    displayCocktails(response.drinks)

}

const getLookupCocktail = async (id) => {
    const request = await fetch(`${API}${LOOKUP_COCKTAIL_DETAIL}${id.idDrink}`)
    const response = await request.json()

    console.log(response.drinks[0]);
    displayLookup(response.drinks[0])
}


searchInput.addEventListener('keypress', (e) => {

    setTimeout(() => {
        if (e.target.value.length >= 2) {
            getCocktailByName()
        }
    }, 100)

})

alcoholicFilter.addEventListener('change', (e) => {
    getAlcoholicFilter(e.target.value)
})
getAllCocktails()