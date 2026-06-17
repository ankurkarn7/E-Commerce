import React from 'react'
import { useAuth } from '../../context/AuthContext'
import HomeSeller from './HomeSeller';
import Home from './Home';

const HomeWrapper = () => {

    const {user} = useAuth();

  return user?.role === 'seller' ? <HomeSeller /> : <Home />
}

export default HomeWrapper
