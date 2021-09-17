describe('client-components: CircularProgressWithLabel component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=circularprogresswithlabel--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to CircularProgressWithLabel!');
    });
});
