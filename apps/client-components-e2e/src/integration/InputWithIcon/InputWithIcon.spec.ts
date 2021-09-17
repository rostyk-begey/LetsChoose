describe('client-components: InputWithIcon component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=inputwithicon--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to InputWithIcon!');
    });
});
