import React, { Component } from "react";

export default class TodoList extends Component {
  description = React.createRef();
  btnSubmit = React.createRef();
  constructor() {
    super();
    this.state = {
      list: [],
      editedId: 1,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDel = this.handleDel.bind(this);
    this.handleDelDone = this.handleDelDone.bind(this);
    this.handleModier = this.handleModier.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    if (this.btnSubmit.current.innerHTML == "Ajouter") {
      const nvTache = {
        id: new Date().getTime(),
        description: this.description.current.value,
        terminee: false,
      };

      this.setState({
        list: [...this.state.list, nvTache],
      });
      this.description.current.value = "";
    } else {
      this.setState({
        list: this.state.list.map((t) =>
          t.id == this.state.editedId
            ? { ...t, description: this.description.current.value }
            : t
        ),
      });

      this.btnSubmit.current.innerHTML = "Ajouter";
      this.description.current.value = "";
    }
  }
  handleChange(id) {
    const copie = [...this.state.list];
    //Méthode1
    const trouvé = copie.find((t) => t.id === id);
    if (trouvé) {
      trouvé.terminee = !trouvé.terminee;
    }

    //Méthode2
    // copie.map((t) => {
    //   if (t.id === id) t.terminee = !t.terminee;
    // });

    this.setState({ list: copie });
  }
  handleDel(tache) {
    if (
      window.confirm(
        "Voulez vous vraiment supprimer " + tache.description + "?"
      )
    ) {
      if (!tache.terminee)
        this.setState({
          list: this.state.list.filter((t) => t.id !== tache.id),
        });
    }
  }
  handleDelDone() {
    this.setState({
      list: this.state.list.filter((t) => !t.terminee),
    });
  }
  handleModier(tache) {
    this.btnSubmit.current.innerHTML = "Modifier";
    this.description.current.value = tache.description;

    this.setState({ editedId: tache.id });
  }
  calculerTachesrestantes() {
    return this.state.list.filter((t) => !t.terminee).length;
  }

  componentDidMount() {
    const data = JSON.parse(localStorage.getItem("taches"));
    if (data) this.setState({ list: data });
  }
  componentDidUpdate(ancienProps, ancienState) {
    if (ancienState !== this.state)
      localStorage.setItem("taches", JSON.stringify(this.state.list));
  }
  render() {
    console.log(this.state.list);
    return (
      <div className="text-center container">
        <h2 className="mb-3">Gestion des tâches</h2>
        <form action="" onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Ajouter une tâche"
            ref={this.description}
          />

          <button type="submit" ref={this.btnSubmit}>
            Ajouter
          </button>
        </form>
        <div className="mt-5 w-50 mx-auto">
          <p>
            Nombre des tâches restantes: {this.calculerTachesrestantes()} <br />
            <a href="#" onClick={this.handleDelDone}>
              Effacer toutes les tâches terminées
            </a>
          </p>
          <ul className="list-group text-start">
            {this.state.list.map((tache, i) => (
              <li key={i} className="list-group-item">
                <input
                  type="checkbox"
                  checked={tache.terminee}
                  onChange={() => this.handleChange(tache.id)}
                />
                <label className="pe-4">{tache.description}</label>
                <button
                  className="btn btn-danger"
                  onClick={() => this.handleDel(tache)}
                >
                  X
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => this.handleModier(tache)}
                >
                  Modifier
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
