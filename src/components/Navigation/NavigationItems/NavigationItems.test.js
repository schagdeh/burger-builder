import React from 'react'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import NavigationItems from './NavigationItems'
import NavigationItem from '../NavigationItem/NavigationItem'

configure({adapter: new Adapter()})

let wrapper
describe('<NavigationItems />', () => {

  beforeEach(() => {
    wrapper = shallow(<NavigationItems/>)
  })

  it('should render two <NavigationItems /> elements if not authenticated', () => {
    // first option
    //const wrapper = shallow(<NavigationItems />)

    expect(wrapper.find(NavigationItem)).toHaveLength(2)
  })
  it('should render three <NavigationItems /> elements if not authenticated', () => {
    // first option
    //const wrapper = shallow(<NavigationItems isAuthenticated/>)
    // second option
    //wrapper = shallow(<NavigationItems isAuthenticated />)
    // third option
    wrapper.setProps({isAuthenticated: true})
    expect(wrapper.find(NavigationItem)).toHaveLength(3)

  })
  it('should an exact logout button', () => {
    wrapper.setProps({isAuthenticated: true})
    expect(wrapper.contains(<NavigationItem link='/logout'>Logout</NavigationItem>)).toEqual(true)

  })
})