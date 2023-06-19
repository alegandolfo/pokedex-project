const openModal = (idModal) => {
    const divModal = document.querySelector(idModal)
    divModal.style.display = "flex"
}

const closeModal = (idModal) => {
    const divModal = document.querySelector(idModal)
    divModal.style.display = "none"
}

const handleModalClose = (event) => {
    if(event.target.className === "modal"){
        event.target.style.display = "none"
    }
}

const addPokemon = async (event) => {
    event.preventDefault()
    const newPokemonName = event.target.pokemon.value.toLowerCase()

    const pokemonWasFound = pokemonsList.find((pokemon) => {
        return pokemon.name === newPokemonName
    })
    
    if(pokemonWasFound){
        alert("Pokemon já adicionado!")
        return
    }

    try{
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${newPokemonName}`)
        const data = await response.json()

        if(data.id){
            let pokeTypes = []
            for (var i = 0; i < data.types.length; i++) {pokeTypes[i] = data.types[i].type.name}

            const pokeSprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`
            const pokeShiny = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${data.id}.png`

            const newPokemon = {name: newPokemonName, id: data.id, types: pokeTypes, nickname: '', sprite: pokeSprite, shiny: pokeShiny}

            pokemonsList.push(newPokemon)
            renderPokemons()
            closeModal('#add-pokemon')
        }else{
            alert(`Pokémon not found!`)
        }
    } catch (error){
        alert(error)
    }
}

const addBulkPokemon = async (event) => {
    event.preventDefault()
    const limit = event.target.limit.value
    const offset = event.target.offset.value

    const bulkResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`)
    const bulkData = await bulkResponse.json()

    for (var j = 0; j < bulkData.results.length; j++) {
        const newPokemonName = bulkData.results[j].name.toLowerCase()

        const pokemonWasFound = pokemonsList.find((pokemon) => {
            return pokemon.name === newPokemonName
        })
        
        if(pokemonWasFound){
            continue
        }

        console.log(pokemonWasFound)

        try{
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${newPokemonName}`)
            const data = await response.json()

            if(data.id){
                let pokeTypes = []
                for (var i = 0; i < data.types.length; i++) {pokeTypes[i] = data.types[i].type.name}

                const pokeSprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`
                const pokeShiny = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${data.id}.png`

                const newPokemon = {name: newPokemonName, id: data.id, types: pokeTypes, nickname: '', sprite: pokeSprite, shiny: pokeShiny}

                pokemonsList.push(newPokemon)
                closeModal('#add-pokemon')
            }else{
                alert(`Pokémon not found!`)
            }
        } catch (error){
            alert(error)
        }
    }
    closeModal('#add-bulk-pokemon')
    renderPokemons()
}

const editPokemon = async (event, pokemonName) => {
    event.preventDefault()
    const newPokemonNickname = event.target.pokemon.value
    if (newPokemonNickname.length > 20) {
        alert('This nickname is too big!')
        return
    }

    const newPokemonList = pokemonsList.map((pokemon) => {
        if(pokemon.name === pokemonName){
            return {name: pokemon.name, id: pokemon.id, types: pokemon.types, nickname: newPokemonNickname, sprite: pokemon.sprite, shiny: pokemon.shiny}
        } else {
            return pokemon
        }
    })

    pokemonsList = newPokemonList
    renderPokemons()
    closeModal('#edit-pokemon')
}

const removePokemon = (event) => {
    const btnClose = event.target
    const pokemon = btnClose.closest('.pokemon')
    const h2Pokemon = pokemon.querySelector('h2')
    const pokemonName = h2Pokemon.textContent.toLowerCase()
    const newPokemonList = pokemonsList.filter((pokemon) => {
        return pokemon.name !== pokemonName
    })
    pokemonsList = newPokemonList
    renderPokemons()
}

const handlePokemonMouseEnter = (event) => {
    const pokemon = event.target
    const btnClose = pokemon.querySelector(".btn-close")
    const btnEdit = pokemon.querySelector(".btn-edit")
    btnClose.style.display = "block"
    btnEdit.style.display = "block"
}

const handlePokemonMouseLeave = (event) => {
    const pokemon = event.target
    const btnClose = pokemon.querySelector(".btn-close")
    const btnEdit = pokemon.querySelector(".btn-edit")
    btnClose.style.display = "none"
    btnEdit.style.display = "none"
}

const addPokemonsEvents = () => {
    const pokemons = document.querySelectorAll(".pokemon")
    pokemons.forEach((pokemon) => {
        pokemon.addEventListener("mouseenter", handlePokemonMouseEnter)
        pokemon.addEventListener("mouseleave", handlePokemonMouseLeave)
    })
}

const renderPokemons = () => {
    pokemonsList.sort(function (x, y) {return x.id - y.id})

    const divPokemonsList = document.querySelector("#pokemons-list")
    divPokemonsList.innerHTML = ''
    pokemonsList.forEach((pokemon) => {
        let pokeName = pokemon.name.split('-')
        for (var i = 0; i < pokeName.length; i++) {
            pokeName[i] = pokeName[i].charAt(0).toUpperCase() + pokeName[i].slice(1);
        }
        pokeName = pokeName.join('-')

        let newPokemonTitle
        if (pokemon.nickname.length > 0) {
            newPokemonTitle = `<h2>${pokemon.nickname}</h2>`
        } else {
            newPokemonTitle = `<h2>${pokeName}</h2>`
        }

        let newPokemonTypes
        if (pokemon.types.length > 1) {
            newPokemonTypes = 
            `<div id="types-list">
                <h4><span class="type ${pokemon.types[0]}"></span></h4>
                <h4><span class="type ${pokemon.types[1]}"></span></h4>
            </div>`
        } else {
            newPokemonTypes = 
            `<div id="types-list">
                <h4><span class="type ${pokemon.types[0]}"></span></h4>
            </div>`
        }
        
        const newPokemon = 
            `<div class="pokemon">
                <button class="btn-close" onclick="removePokemon(event)">x</button>
                <button class="btn-edit" onclick="renderEditModal('${pokemon.name}')">✎</button>
                <p>#${pokemon.id}</p>
                ${newPokemonTitle}
                <img src="${pokemon.sprite}" alt="" class="regular-img">
                <img src="${pokemon.shiny}" alt="" class="hover-img">
                ${newPokemonTypes}
            </div>`

        divPokemonsList.innerHTML += newPokemon
    })
    addPokemonsEvents()
}

const renderEditModal = (pName) => {
    const pokemon = pokemonsList.find(function (x) {return x.name == pName})

    const divPokemonModal = document.querySelector("#edit-pokemon")
    divPokemonModal.innerHTML = ''
    
    let pokemonModal = 
        `<div class="modal-content">
            <h1>Edit Pokémon</h1>
            <button class="btn-close" onclick="closeModal('#edit-pokemon')">x</button>
            <form onsubmit="editPokemon(event, '${pokemon.name}')">
                <label for="pokemon">Nickname:</label>
                <input type="text" name="pokemon" id="pokemon" placeholder="Create a nickname for your pokémon!" />
                <input type="submit" value="Edit Pokémon" />
            </form>
        </div>`
    
    divPokemonModal.innerHTML = pokemonModal
    openModal('#edit-pokemon')
}

const modal = document.querySelector(".modal")
modal.addEventListener("click", handleModalClose)

addPokemonsEvents()

let pokemonsList = [
    {name: 'bulbasaur', id: 1, types: ['grass', 'poison'], nickname: 'Jorge', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png', shiny: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/1.png'}, 
    {name: 'ivysaur', id: 2, types: ['grass', 'poison'], nickname: 'Jorge',  sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png', shiny: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/2.png'}, 
    {name: 'venusaur', id: 3, types: ['grass', 'poison'], nickname: 'Jorge',  sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png', shiny: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/3.png'}, 
    {name: 'charmander', id: 4, types: ['fire'], nickname: '',  sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png', shiny: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/4.png'}, 
    {name: 'charmeleon', id: 5, types: ['fire'], nickname: '',  sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/5.png', shiny: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/5.png'}, 
    {name: 'charizard', id: 6, types: ['fire', 'flying'], nickname: '',  sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png', shiny: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/6.png'}, 
    {name: 'squirtle', id: 7, types: ['water'], nickname: '',  sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png', shiny: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/7.png'}, 
    {name: 'wartortle', id: 8, types: ['water'], nickname: '',  sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/8.png', shiny: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/8.png'}, 
    {name: 'blastoise', id: 9, types: ['water'], nickname: '',  sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png', shiny: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/9.png'}
]
renderPokemons()