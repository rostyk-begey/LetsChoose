describe('client-components: PasswordTextInput component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=passwordtextinput--primary'));

  it('should render the component', () => {
    cy.get('h1').should('contain', 'Welcome to PasswordTextInput!');
  });
});
