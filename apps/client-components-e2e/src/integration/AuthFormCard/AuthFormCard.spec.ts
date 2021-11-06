describe('client-components: AuthFormCard component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=authformcard--primary'));

  it('should render the component', () => {
    cy.get('h1').should('contain', 'Welcome to AuthFormCard!');
  });
});
