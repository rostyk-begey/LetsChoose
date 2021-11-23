describe('client-components: ProfileCard component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=profilecard--primary'));

  it('should render the component', () => {
    cy.get('h1').should('contain', 'Welcome to ProfileCard!');
  });
});
