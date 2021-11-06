describe('client-components: Sidebar component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=sidebar--primary'));

  it('should render the component', () => {
    cy.get('h1').should('contain', 'Welcome to Sidebar!');
  });
});
