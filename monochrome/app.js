const ADD_TO_CART_EVENT = 'cart/productAdded';
const REMOVE_FROM_CART_EVENT = 'cart/productRemoved';
const ADD_TO_WISHLIST_EVENT = 'wl/productAdded';
const REMOVE_FROM_WISHLIST_EVENT = 'wl/productRemoved';

class NewsletterForm extends React.Component {
  state = {
    email: '',
    formMessage: '',
    busy: false,
    successMessage: '',
  };

  validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return re.test(email);
  };

  onSubmit = (event) => {
    event.preventDefault();
    const email = this.state.email;

    if (!this.validateEmail(email)) {
      this.setState({
        formMessage: 'Please enter a valid email.',
      });

      return;
    }

    this.setState({
      busy: true,
      formMessage: '',
    });

    setTimeout(() => {
      this.setState({
        busy: false,
        email: '',
        successMessage: `The ${email} has been registered.`,
      });
    }, 3000);
  };

  onInputChange = (event) => {
    this.setState({
      email: event.target.value,
    });
  };

  render = () => {
    const isSubmitted = this.state.successMessage.trim().length > 0;

    if (isSubmitted) {
      return <div className="container">{this.state.successMessage}</div>;
    }

    return (
      <form className="form-newsletter container" onSubmit={this.onSubmit}>
        <label htmlFor="email-newsletter">Sign up for our newsletter</label>

        <input
          type="text"
          name="email-newsletter"
          id="email-newsletter"
          placeholder="Enter your email address"
          onChange={this.onInputChange}
          value={this.state.email}
        ></input>

        <button type="submit" title="Subscribe" disabled={this.state.busy}>
          {this.state.busy ? '...loading' : 'Submit'}
        </button>

        <div className="form-message">{this.state.formMessage}</div>
      </form>
    );
  };
}

const newsletterContainer = document.querySelector(
  '.footer-sign-up-newsletter',
);
ReactDOM.createRoot(newsletterContainer).render(
  <NewsletterForm></NewsletterForm>,
);

class AddToCartButton extends React.Component {
  state = {
    added: false,
    busy: false,
  };

  onClick = () => {
    this.setState({
      busy: true,
    });

    setTimeout(() => {
      const cartEvent = this.state.added
        ? REMOVE_FROM_CART_EVENT
        : ADD_TO_CART_EVENT;

      dispatchEvent(
        new CustomEvent(cartEvent, {
          detail: {
            productId: this.props.productId,
          },
        }),
      );

      this.setState({
        added: !this.state.added,
        busy: false,
      });
    }, 2000);
  };

  render() {
    return (
      <button
        className={`product-control ${this.state.added ? 'active' : ''}`}
        onClick={this.onClick}
        type="button"
        title={this.state.added === true ? 'Remove from Bag' : 'Add to Bag'}
        disabled={this.state.busy}
      >
        {this.state.added === true ? (
          `PID: ${this.props.productId} in bag`
        ) : (
          <i className="far fa-plus-square icon"></i>
        )}
        {this.state.busy ? <i className="fas fa-spinner spinner-icon"></i> : ''}
      </button>
    );
  }
}

const AddToWishlistButton = ({ productId }) => {
  const state = React.useState({
    added: false,
    busy: false,
  });
  const actualState = state[0];
  const setState = state[1];

  const onClick = () => {
    setState({
      added: actualState.added,
      busy: true,
    });

    setTimeout(() => {
      const wishilistEvent = new CustomEvent(
        actualState.added ? REMOVE_FROM_WISHLIST_EVENT : ADD_TO_WISHLIST_EVENT,
        {
          detail: {
            productId,
          },
        },
      );

      dispatchEvent(wishilistEvent);

      setState({
        added: !actualState.added,
        busy: false,
      });
    }, 500);
  };

  return (
    <button
      className={`product-control ${actualState.added ? 'active' : ''}`}
      title={actualState.added ? 'Remove from Wishlist' : 'Add to Wishlist'}
      type="button"
      onClick={onClick}
    >
      {actualState.added === true ? (
        `PID: ${productId} in wishlist`
      ) : (
        <i className="far fa-heart"></i>
      )}
      {actualState.busy ? <i className="fas fa-spinner  spinner-icon"></i> : ''}
    </button>
  );
};

class ProductControls extends React.Component {
  render() {
    const productId = this.props.productId;

    const WrappedButtonCart = ({ productId }) => {
      return <AddToCartButton productId={productId}></AddToCartButton>;
    };

    const WrappedButtonWish = ({ productId }) => {
      return <AddToWishlistButton productId={productId}></AddToWishlistButton>;
    };

    return [
      <WrappedButtonCart productId={productId} key="cart"></WrappedButtonCart>,
      <WrappedButtonWish productId={productId} key="wish"></WrappedButtonWish>,
    ];
  }
}

const productTileControls = document.querySelectorAll('.product-tile-controls');
productTileControls.forEach((productTileControl, index) => {
  ReactDOM.createRoot(productTileControl).render(
    <ProductControls productId={index}></ProductControls>,
  );
});

class HeaderCounters extends React.Component {
  state = {
    cartItemsCount: 0,
    cartItems: [],
    wishlistItemsCount: 0,
    wishlistItems: [],
  };

  productCartAction = (event) => {
    const { productId } = event.detail;
    alert(productId);
    const cartItems = this.state.cartItems.slice();
    const { type: eventType } = event;

    switch (eventType) {
      case ADD_TO_CART_EVENT:
        cartItems.push(productId);
        this.setState({
          cartItems,
          cartItemsCount: this.state.cartItemsCount + 1,
        });
        break;

      case REMOVE_FROM_CART_EVENT:
        this.setState({
          cartItems: cartItems.filter((item) => {
            return item !== productId;
          }),
          cartItemsCount: this.state.cartItemsCount - 1,
        });
    }
  };

  productWishlistAction = (event) => {
    const productId = event.detail.productId;

    switch (event.type) {
      case ADD_TO_WISHLIST_EVENT:
        const newProductIds =
          this.state.wishlistItems.length === 0
            ? [productId]
            : [...this.state.wishlistItems, productId];

        this.setState({
          wishlistItems: newProductIds,
          wishlistItemsCount: this.state.wishlistItemsCount + 1,
        });
        break;
    }
  };

  componentDidMount() {
    addEventListener(ADD_TO_CART_EVENT, this.productCartAction);
    addEventListener(REMOVE_FROM_CART_EVENT, this.productCartAction);

    addEventListener(ADD_TO_WISHLIST_EVENT, this.productWishlistAction);
    addEventListener(REMOVE_FROM_WISHLIST_EVENT, this.productWishlistAction);
  }

  componentWillUnmount() {
    removeEventListener(ADD_TO_CART_EVENT, this.productCartAction);
    removeEventListener(REMOVE_FROM_CART_EVENT, this.productCartAction);

    removeEventListener(ADD_TO_WISHLIST_EVENT, this.productWishlistAction);
    removeEventListener(REMOVE_FROM_WISHLIST_EVENT, this.productWishlistAction);
  }

  showProducts = (collection, displayName) => {
    let message = '';

    if (this.state[collection].length <= 0) {
      message = `There are no products in your ${displayName}`;
    } else {
      message = `These are the pids in your ${displayName}: ${this.state[collection]}`;
    }

    alert(message);
  };

  render() {
    return (
      <>
        <div
          className="header-counter"
          onClick={() => {
            this.showProducts('wishlistItems', 'wishlist');
          }}
        >
          <span className="qty">{this.state.wishlistItemsCount}</span>
          <i className="fas fa-heart icon"></i>
        </div>

        <div
          className="header-counter"
          onClick={() => {
            this.showProducts('cartItems', 'cart');
          }}
        >
          <span className="qty">{this.state.cartItemsCount}</span>
          <i className="fas fa-shopping-bag icon"></i>
        </div>
      </>
    );
  }
}

const headerCounters = document.querySelector('.header-counters');
ReactDOM.createRoot(headerCounters).render(<HeaderCounters></HeaderCounters>);
