import React, {useState, useEffect,useCallback} from 'react';
import {FlatList, ScrollView, View, StyleSheet, Dimensions,ActivityIndicator} from 'react-native';
import ProductList from './ProductList';
import {Container, Item, Header, Icon, Input, Text} from 'native-base';
import SearchedProduct from './SearchedProduct';
import Banner from '../../components/Banner';
import CategoriesFilter from './CategoriesFilter';
import colors from '../../assets/constants/colors';
import baseURL from '../../assets/common/baseUrl';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';

// const data = require('../../data/products.json');
// const productCategories = require('../../data/categories.json');
var {height} = Dimensions.get('window');

const ProductContainer = props => {
  const [products, setProducts] = useState([]);
  const [productsFiltered, setProductsFiltered] = useState([]);
  const [focus, setFocus] = useState();
  const [categories, setCategories] = useState([]);
  const [active, setActive] = useState();
  const [initialState, setInitialState] = useState([]);
  const [productsCtg, setProductsCtg] = useState([]);
  const [loading, setLoading] = useState(true)
  useFocusEffect((
    useCallback(
      () => {
        setFocus(false);
        setActive(-1);
        
        // Products
        axios
          .get(`${baseURL}products`)
          .then((res) => {
            setProducts(res.data);
            setProductsFiltered(res.data);
            setProductsCtg(res.data);
            setInitialState(res.data);
            setLoading(false)
          })
          .catch((error) => {
            console.log('Api call error')
          })
    
        // Categories
        axios
          .get(`${baseURL}categories`)
          .then((res) => {
            setCategories(res.data)
          })
          .catch((error) => {
            console.log('Api call error')
          })
    
        return () => {
          setProducts([]);
          setProductsFiltered([]);
          setFocus();
          setCategories([]);
          setActive();
          setInitialState();
        };
      },
      [],
    )
  ))
  


  // Product Methods
  const searchProduct = (text) => {
    setProductsFiltered(
      products.filter((i) => i.name.toLowerCase().includes(text.toLowerCase()))
    );
  };

  const openList = () => {
    setFocus(true);
  };

  const onBlur = () => {
    setFocus(false);
  };

  // Categories
  const changeCtg = (ctg) => {
    {
      ctg === "all"
        ? [setProductsCtg(initialState), setActive(true)]
        : [
            setProductsCtg(
              products.filter((i) => i.category._id === ctg),
              setActive(true)
            ),
          ];
    }
  };

  return (
    <>
    {loading == false ? (
 <Container>
 <Header searchBar rounded>
   <Item>
     <Icon name="add" />
     <Input
       placeholder="Search"
       onFocus={openList}
       onChangeText={(text) => searchProduct(text)}
     />
     {focus == true ? <Icon onPress={onBlur} name="close" /> : null}
   </Item>
 </Header>
 {focus == true ? (
   <SearchedProduct 
   navigation={props.navigation}
   productsFiltered={productsFiltered} />
 ) : (
   <ScrollView>
     <View>
       <View>
         <Banner />
       </View>
       <View>
         <CategoriesFilter
           categories={categories}
           categoryFilter={changeCtg}
           productsCtg={productsCtg}
           active={active}
           setActive={setActive}
         />
       </View>
       {productsCtg.length > 0 ? (
       <View style={styles.listContainer}>
           {productsCtg.map((item) => {
               return(
                   <ProductList
                       navigation={props.navigation}
                       key={item.name}
                       item={item}
                   />
               )
           })}
       </View>
       ) : (
           <View style={[styles.center, { height: height / 2}]}>
               <Text>No products found</Text>
           </View>
       )}
      
     </View>
   </ScrollView>
 )}
</Container>
    ) : (
      // Loading
      <Container style={[styles.center, { backgroundColor: "#f2f2f2" }]}>
        <ActivityIndicator size="large" color="red" />
      </Container>
    )}
   </>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    height: height,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    backgroundColor: colors.SCREEN_BACKGROUND,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    height: height / 2,
  },
});
export default ProductContainer;