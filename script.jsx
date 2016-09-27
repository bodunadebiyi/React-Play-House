/** Game Nine */
var possibleCombinationSum = function(arr, n) {
  if (arr.indexOf(n) >= 0) { return true; }
  if (arr[0] > n) { return false; }
  if (arr[arr.length - 1] > n) {
    arr.pop();
    return possibleCombinationSum(arr, n);
  }
  var listSize = arr.length, combinationsCount = (1 << listSize)
  for (var i = 1; i < combinationsCount ; i++ ) {
    var combinationSum = 0;
    for (var j=0 ; j < listSize ; j++) {
      if (i & (1 << j)) { combinationSum += arr[j]; }
    }
    if (n === combinationSum) { return true; }
  }
  return false;
};

var StarFrame = React.createClass({
  render: function () {
    var stars = [];
    for (var i=0; i<this.props.numOfStars; i++) {
      stars.push(<span className="glyphicon glyphicon-star" key={i}></span>);
    }

    return (
      <div id="stars-frame" className=" col-md-5 col-xs-5">
        <div className="well">
          { stars }
        </div>
      </div>
    );
  }
});

var ButtonFrame = React.createClass({
  render: function () {
    var disabled = (this.props.selectedNumbers.length === 0)
    var button, correct = this.props.correct;
    switch(correct) {
      case true:
        button = (
          <button className="btn btn-lg btn-success" disabled={disabled} onClick={this.props.submitAnswer}>
            <i className="glyphicon glyphicon-ok"></i>
          </button>
        )
        break;
      case false:
        button = (
          <button className="btn btn-lg btn-danger" disabled={disabled}>
            <i className="glyphicon glyphicon-remove"></i>
          </button>
        )
        break;
      default:
        button = (
          <button className="btn btn-lg btn-primary" disabled={disabled} onClick={this.props.checkAnswer}>
            =
          </button>
        )
    }

    return (
      <div id="button-frame" className= "col-md-2 col-xs-2">
        { button }
        <br /><br />
        <button className="btn btn-warning btn-xs" onClick={ this.props.redraw }
        disabled={ this.props.redraws === 0 }>
          <i className="glyphicon glyphicon-refresh"></i> &nbsp; { this.props.redraws }
        </button>
      </div>
    );
  }
});

var AnswerFrame = React.createClass({
  unselectNumber: function (num) {
    this.props.unselectNumber(num);
  },
  getSelectedNums: function () {
    var that = this;
    var selectedNums = this.props.selectedNumbers.map(function (e, i) {
      return (<span key={i} onClick={ that.unselectNumber.bind(null, e) }> {e} </span>)
    });

    return selectedNums;
  },
  render: function () {
    return (
      <div id="answer-frame" className="col-md-5 col-xs-5">
        <div className="well">
          { this.getSelectedNums() }
        </div>
      </div>
    );
  }
});

var NumberFrame = React.createClass({
  selectNumber: function (clickedNum) {
    return this.props.selectNumber(clickedNum);
  },
  render: function () {
    var numbers = [];

    for (var i=1; i<10; i++) {
      var className = this.props.selectedNumbers.indexOf(i) == -1 ? 'number' : 'number -selected';
      className += this.props.usedNumbers.indexOf(i) > -1 ? ' -submitted' : '';
      var number = <div className={className} key={i} onClick={ this.selectNumber.bind(null, i) }>{i}</div>;
      numbers.push(number);
    }

    return (
      <div id="number-frame" className="col-md-12 col-xs-12">
        <div className="well">
          { numbers }
        </div>
      </div>
    );
  }
});

var DoneFrame = React.createClass({
  render: function () {
    return (
      <div className="well text-center">
        <h1> { this.props.doneStatus } </h1>
        <button className="btn btn-success" onClick={ this.props.resetGame }> Play Again! </button>
      </div>
    )
  }
})

var Game = React.createClass({
  getInitialState: function () {
    return {
      numOfStars: Math.floor(Math.random() * 9) + 1,
      selectedNumbers: [],
      usedNumbers: [],
      redraws: 5,
      correct: null,
      doneStatus: null
    }
  },
  selectNumber: function (clickedNum) {
    if (this.state.selectedNumbers.indexOf(clickedNum) < 0 &&
    this.state.usedNumbers.indexOf(clickedNum) < 0) {
      this.setState({
        selectedNumbers: this.state.selectedNumbers.concat(clickedNum),
        correct: null
      });
    }
  },
  unselectNumber: function (clickedNum) {
    var selectedIndex = this.state.selectedNumbers.indexOf(clickedNum);
    var selectedNumbers = this.state.selectedNumbers;

    selectedNumbers.splice(selectedIndex, 1);
    this.setState({
      selectedNumbers: selectedNumbers,
      correct: null
    })
  },
  submitAnswer: function () {
    this.setState({
      usedNumbers: this.state.usedNumbers.concat(this.state.selectedNumbers),
      selectedNumbers: [],
      correct: null,
      numOfStars: Math.floor(Math.random() * 9) + 1
    }, function () {
      this.updateDoneStatus();
    })
  },
  checkAnswer: function () {
    var sumOfSelectedNumbers = this.state.selectedNumbers.reduce(function (total, curr) {
      return total + curr;
    }, 0);
    this.setState({ correct: this.state.numOfStars === sumOfSelectedNumbers })
  },
  redraw: function () {
    if (this.state.redraws > 0) {
      this.setState({
        correct: null,
        selectedNumbers: [],
        numOfStars: Math.floor(Math.random() * 9) + 1,
        redraws: this.state.redraws - 1
      }, function () {
        this.updateDoneStatus();
      });
    }
  },
  resetGame: function () {
    this.replaceState(this.getInitialState())
  },
  possibleSolutions: function () {
    var numOfStars = this.state.numOfStars,
        possibleNumbers = [],
        usedNumbers = this.state.usedNumbers;

    for (var i=1; i<=9; i++) {
      if (usedNumbers.indexOf(i) < 0) {
        possibleNumbers.push(i);
      }
    }

    return possibleCombinationSum(possibleNumbers, numOfStars);
  },
  updateDoneStatus: function () {
    if (this.state.usedNumbers.length === 9) {
      this.setState({ doneStatus: 'Great Job, you win!' });
      return;
    }

    if (this.state.redraws ===  0 && !this.possibleSolutions()) {
      this.setState({ doneStatus: 'Game Over!' });
    }

    return;
  },
  render: function () {
    var selectedNumbers = this.state.selectedNumbers;
    var submittedNumbers = this.state.usedNumbers;
    var numOfStars = this.state.numOfStars;
    var bottomFrame;

    if (this.state.doneStatus) {
      bottomFrame = (
        <DoneFrame doneStatus={ this.state.doneStatus } resetGame={this.resetGame}/>
      )
    } else {
      bottomFrame = (
        <NumberFrame
          selectedNumbers={ selectedNumbers }
          selectNumber={ this.selectNumber }
          usedNumbers = { submittedNumbers }
        />
      )
    }

    return (
      <div id="game" className="wrapper row">
        <div className="col-md-12 col-xs-12">
          <h2><img src="images/game.png" width="70" /> Play Nine</h2>
          <hr/>
        </div>
        <div className="row">
          <StarFrame
            numOfStars={ numOfStars }
          />
          <ButtonFrame
            selectedNumbers={ selectedNumbers }
            correct={ this.state.correct }
            checkAnswer = { this.checkAnswer }
            submitAnswer = { this.submitAnswer }
            redraw = { this.redraw }
            redraws = { this.state.redraws }
          />
          <AnswerFrame
            selectedNumbers={ selectedNumbers }
            unselectNumber = { this.unselectNumber }
          />
        </div>
        { bottomFrame }
      </div>
    )
  }
});

ReactDOM.render(<Game />, document.getElementById('container'));

/** Start of GitHubCardLister */
var Card = React.createClass({
  getInitialState: function () {
    return {};
  },
  componentDidMount: function () {
    var component = this;
    $.get("https://api.github.com/users/" + this.props.username, function (data) {
      component.setState(data);
      console.log(data);
    });
  },
  render: function () {
    return (
      <div className="col-xs-6 col-md-6">
        <div className="row cards">
          <div className="col-md-5 text-center">
            <img src={ this.state.avatar_url } className="img img-circle" width="140" height="auto" />
          </div>
          <div className="col-md-5">
            <p><i className="fa fa-user"></i> { this.state.name }</p>
            <p><i className="fa fa-briefcase"></i> { this.state.company }</p>
            <p><i className="fa fa-sign-in"></i> { this.state.login }</p>
            <p><i className="fa fa-users"></i> { this.state.followers } followers</p>
            <p><i className="fa fa-map-marker"></i> { this.state.location }</p>
            <p><i className="fa fa-square"></i> { this.state.public_repos } repos</p>
          </div>
        </div>
      </div>
    )
  }
});

var Form = React.createClass({
  handleSubmit: function (e) {
    e.preventDefault();
    this.props.addCard(this.refs.login.value);
    this.refs.login.value = '';
  },
  render: function () {
    return (
      <div className="row">
        <form onSubmit={ this.handleSubmit }>
          <div className="col-md-12 col-xs-12">
            <input type='text' className='form-control' placeholder='enter github username' ref='login' />
          </div>
          <div className="col-md-12 col-xs-12 text-center">
            <button className="btn btn-success github-fetch-button">Fetch User Github Info</button>
          </div>
        </form>
      </div>
    )
  }
})

var GithubCardList = React.createClass({
  getInitialState: function () {
    return { usernames: [] }
  },
  addCard: function (login) {
    this.setState({ usernames: this.state.usernames.concat(login) });
  },
  render: function () {
    var cardList = this.state.usernames.map(function (login, i) {
      return (
        <Card username={login} key={i}/>
      )
    });
    return(
    <div className="wrapper row">
      <h2><img src="images/github.png" width="60" /> Github Profile Fetcher</h2>
      <hr/>
      <div className="col-md-offset-3 col-xs-offset-3 col-md-6 col-xs-6">
        <Form addCard={ this.addCard } />
      </div>
      <div className="col-md-12 col-xs-12 card-list">
        <div className="row">
          { cardList }
        </div>
      </div>
    </div>
    )
  }
})

/** End of github cards */


/** Start of Counter Component */
var Button = React.createClass({
  localClickEvent: function () {
    this.props.clickEvent(this.props.count);
  },
  render: function () {
    return (
      <button onClick={ this.localClickEvent }>+{ this.props.count }</button>
    )
  }
});

var LabelCount = React.createClass({
  render: function () {
    return (<div>{ this.props.counterState }</div>)
  }
});

var Counter = React.createClass({
  getInitialState: function () {
    return { counter: 0 }
  },
  handleClickEvent: function (count) {
    this.setState({ counter: this.state.counter + count });
  },
  render: function () {
    return (
      <div>
        <h2>Incrementer</h2>
        <hr/>
        <Button clickEvent={ this.handleClickEvent } count={1} />
        <Button clickEvent={ this.handleClickEvent } count={5} />
        <Button clickEvent={ this.handleClickEvent } count={10} />
        <Button clickEvent={ this.handleClickEvent } count={15} />
        <LabelCount counterState={ this.state.counter }/>
      </div>
    )
  }
});
/** End of Counter */

ReactDOM.render(<GithubCardList />, document.getElementById('github-card'));
ReactDOM.render(<Counter />, document.getElementById('counter'));