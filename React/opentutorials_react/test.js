// const obj = {
//     name: 'hyunseo',
//     age: 20,
//     render() {
//         console.log(this)
//     }
// }

// const obj_2 = {
//     name: 'hyunseo2',
//     age: 21,
//     presentation() {
//         obj.render()
//     }
// }

// obj_2.presentation()

// const object = [
//     {
//         id: 1
//     },
//     {
//         id: 2
//     }
// ]

// const newObject =
// {
//     id: 3
// }

// const concat_object = [...object, newObject]
// console.log(concat_object)

class A {
    constructor(props) {
        console.log("constructor", this)
        this.name = props
    }

    render() {
        console.log(this)
    }

    render_2 = () => {
        console.log(this)
    }
}

const onChange = new A('hyunseo').render
onChange()