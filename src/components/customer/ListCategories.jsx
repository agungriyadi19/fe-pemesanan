import axios from 'axios'
import React, { Component } from 'react'
import { Endpoints } from "../../api"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUtensils, faCoffee, faCheese } from '@fortawesome/free-solid-svg-icons'

const Icon = ({ nama }) => {
  if (nama === 'Makanan') return <FontAwesomeIcon icon={faUtensils} className="mr-2" />
  if (nama === 'Minuman') return <FontAwesomeIcon icon={faCoffee} />
  if (nama === 'Cemilan') return <FontAwesomeIcon icon={faCheese} className="mr-2" />

  return <FontAwesomeIcon icon={faUtensils} className="mr-2" />
}

export default class ListCategories extends Component {
  constructor(props) {
    super(props)

    this.state = {
      categories: []
    }
  }

  componentDidMount() {
    axios.get(Endpoints.category)
      .then(res => {
        const categories = res.data.categories;
        console.log(categories);
        this.setState({ categories });
      })
      .catch(error => {
        console.log(error);
      })
  }

  render() {
    const { categories } = this.state
    const { changeCategory, dipilih } = this.props
    return (
      <div className="">
        <h4 className="font-bold">Daftar Kategori</h4>
        <hr className="my-2" />
        <div className="bg-white shadow-md rounded-md">
          {categories && categories.map((category) => (
            <div key={category.id}
              onClick={() => changeCategory(category.id)}
              className={`p-4 cursor-pointer hover:bg-gray-100 ${dipilih === category.id ? 'bg-blue-100' : ''}`}>
              <h5 className="flex items-center">
                <Icon nama={category.name} /> {category.name}
              </h5>
            </div>
          ))}
        </div>
      </div>
    )
  }
}
