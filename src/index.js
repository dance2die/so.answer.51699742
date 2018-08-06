import React from "react";
import ReactDOM from "react-dom";
import debounce from "lodash.debounce";

import "./styles.css";

const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes?q=";
const GOOGLE_BOOKS_API_LIMIT = "maxResults=10";

class BookItem extends React.Component {
  render() {
    const { imageLinks } = this.props.data.volumeInfo;

    if (!imageLinks) {
      return null;
    }

    return (
      <div>
        <img alt="Book" src={imageLinks.thumbnail} />
        <span>{imageLinks.thumbnail}</span>
      </div>
    );
  }
}

class BookResults extends React.Component {
  render() {
    const isBookResultsEmpty = !(
      this.props.books && this.props.books.length > 1
    );
    const bookItems = isBookResultsEmpty
      ? []
      : this.props.books.map((book, index) => (
          <BookItem key={index} data={book} />
        ));
    return (
      <div className="book-results">
        {isBookResultsEmpty ? <h1>No Results</h1> : <div> {bookItems} </div>}
      </div>
    );
  }
}

class BookSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bookQuery: "",
      books: []
    };
    this.getBooks = this.getBooks.bind(this);
  }

  getBooks() {
    let queryString = "";
    if (this.state.bookQuery && this.state.bookQuery.length > 1) {
      queryString = this.state.bookQuery.replace(/\s/g, "+");
      fetch(`${GOOGLE_BOOKS_API}${queryString}&${GOOGLE_BOOKS_API_LIMIT}`)
        .then(results => {
          return results.json();
        })
        .then(json => {
          console.log(`books:`, json.items);
          this.setState({
            books: json.items
          });
        })
        .catch(e => console.log("error", e));
    }
  }

  handleInputChange = debounce(event => {
    this.setState(
      {
        bookQuery: this.search.value
      },
      this.getBooks()
    );
  }, 300);

  render() {
    return (
      <div className="book-search">
        <form>
          <input
            placeholder="Search for Books"
            ref={input => (this.search = input)}
            onKeyUp={this.handleInputChange}
          />
        </form>
        <BookResults books={this.state.books} />
      </div>
    );
  }
}

ReactDOM.render(<BookSearch />, document.getElementById("root"));
