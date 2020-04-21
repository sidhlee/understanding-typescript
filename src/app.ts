/* 
Goal:
1. get the user input value
2. populate template with data
3. render it
*/

/* Decorators - enable "experimentalDecorators" in tsconfig.json */

// using underscore as argument name suppresses "noUnused" warnings
function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const decoratedMethod = descriptor.value;
  const updatedDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = decoratedMethod.bind(this);
      return boundFn;
    },
  };
  return updatedDescriptor;
}

/* Classes */

class ProjectInput {
  // became available with tsconfig.compilerOptions.lib: ["dom"]
  templateElement: HTMLTemplateElement;
  app: HTMLDivElement;
  formElement: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    // select this element which is not null and of HTMLTemplateElement type.
    this.templateElement = document.getElementById(
      'project-input'
    )! as HTMLTemplateElement;
    // typecasting with 'as' (you could also use <> before the expression)
    this.app = document.getElementById('app')! as HTMLDivElement;

    // when this class creates an instance, we want to immediately render the form that belongs to this element. So we'll do it in the constructor.
    const importedNode = document.importNode(
      this.templateElement.content,
      true //deep=true
    ); // returns DocumentFragment

    this.formElement = importedNode.firstElementChild as HTMLFormElement;
    // write css first, then add id (or class) to the element before render
    this.formElement.id = 'user-input'; // interacting with element

    // populating fields with DOM elements
    this.titleInputElement = this.formElement.querySelector(
      '#title'
    ) as HTMLInputElement;
    this.descriptionInputElement = this.formElement.querySelector(
      '#description'
    ) as HTMLInputElement;
    this.peopleInputElement = this.formElement.querySelector(
      '#people'
    ) as HTMLInputElement;

    this.configure();
    this.attach();
  }

  private getUserInputs(): [string, string, number] | void {
    //returns tuple | void (if validation fails)
    const titleValue = this.titleInputElement.value;
    const descriptionValue = this.descriptionInputElement.value;
    const peopleValue = this.peopleInputElement.value;

    // not a reusable validation. only for now.
    if (
      titleValue.trim().length === 0 ||
      descriptionValue.trim().length === 0 ||
      peopleValue.trim().length === 0
    ) {
      alert('You must fill in all the inputs!');
      return; // we have to return specified type(s)
    } else {
      return [titleValue, descriptionValue, +peopleValue];
    }
  }

  private clearInputs() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
  }

  // use decorator - otherwise we have to .bind(this) every time we use this method
  @autobind
  private submitHandler(e: Event) {
    e.preventDefault();
    const userInputs = this.getUserInputs();
    if (Array.isArray(userInputs)) {
      // To destructure array element, you have to put inside the type-guard!
      const [title, desc, people] = userInputs;
      console.log(title, desc, people);
      this.clearInputs();
    }
  }

  // add listeners to elements
  private configure() {
    // watchout for 'this' when adding eventListeners
    this.formElement.addEventListener('submit', this.submitHandler);
  }

  private attach() {
    // beforebegin = before(elm)
    // afterbegin = prepend(elm)
    // beforeend = appendChild(elm)
    // afterend = after(elm)
    this.app.insertAdjacentElement('afterbegin', this.formElement);
  }
}

// Instantiate to render
const projectInput = new ProjectInput();
