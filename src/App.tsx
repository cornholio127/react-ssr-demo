import React from 'react';
import { ErrorBoundary } from './components';
import { Route } from 'react-router';
import { Home, Product, ProductDetails, Cart } from './pages';

interface Props {

}

const App: React.FunctionComponent<Props> = props => {
  return (
    <ErrorBoundary>
      <React.Fragment>
        <Route exact={true} path="/" component={Home} />
        <Route exact={true} path="/products" component={Product} />
        <Route path="/products/:productId" component={ProductDetails} />
        <Route path="/cart" component={Cart} />
      </React.Fragment>
    </ErrorBoundary>
  );
};

export default App;
