describe('client-components: ContestNavigation component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=contestnavigation--primary'));

  it('should render the component', () => {
    cy.get('h1').should('contain', 'Welcome to ContestNavigation!');
  });
});
