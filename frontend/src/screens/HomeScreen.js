import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import Product from "../components/Product";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Paginate from "../components/Paginate";
import { listProducts } from "../actions/productActions";
import ProductCarousel from "../components/ProductCarousel";
const HomeScreen = ({ match }) => {
  const keyword = match.params.keyword;

  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber));
  }, [dispatch, keyword, pageNumber]);

  // console.log(products);

  return (
    <>
      {!keyword && <ProductCarousel />}
      {/* {console.log(loading)} */}
      <h1>Latest Products</h1>

      {loading ? (
        <Loader />
      ) : error ? (
        <h3>
          <Message variant="danger">{error}</Message>
        </h3>
      ) : (
        <>
          <Row>
            {products &&
              products.map((product) => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                  <Product product={product} />
                  {/* <h3>{product.name}</h3> */}
                </Col>
              ))}
          </Row>
          <Paginate
            pages={pages}
            page={page}
            isAdmin={false}
            keyword={keyword ? keyword : ""}
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;
