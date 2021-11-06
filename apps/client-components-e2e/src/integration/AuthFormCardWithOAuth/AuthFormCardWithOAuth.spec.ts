describe('client-components: AuthFormCardWithOAuth component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=authformcardwithoauth--primary'));

  it('should render the component', () => {
    cy.get('h1').should('contain', 'Welcome to AuthFormCardWithOAuth!');
  });
});
