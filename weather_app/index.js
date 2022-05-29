async function getData() {
    let data = await fetch('https://jsonplaceholder.typicode.com/users')
            .then(res => res.json())

    console.log(data)
    data.map((data, index) => {
        console.log(data.name)
    })
}

getData()