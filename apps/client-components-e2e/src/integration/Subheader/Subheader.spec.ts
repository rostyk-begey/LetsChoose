describe('client-components: Subheader component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=subheader--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to Subheader!');
    });
});
