describe('client-components: Page component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=page--primary'));

  it('should render the component', () => {
    cy.get('h1').should('contain', 'Welcome to Page!');
  });
});
