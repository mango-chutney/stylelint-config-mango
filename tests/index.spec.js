const stylelint = require('stylelint');
const fs = require('fs');
const config = require('../');

const validCss = fs.readFileSync('./tests/scss-valid.scss', 'utf-8');
const invalidCss = fs.readFileSync('./tests/scss-invalid.scss', 'utf-8');

describe('flags no warnings with valid scss', () => {
  let result;

  beforeEach(() => {
    result = stylelint.lint({
      code: validCss,
      config
    });
  });

  it('did not error', () => {
    return result.then(data => expect(data.errored).toBeFalsy());
  });

  it('flags no warnings', () => {
    return result.then(data => expect(data.results[0].warnings.length).toBe(0));
  });
});

describe('flags warnings with invalid css', () => {
  let result;

  beforeEach(() => {
    result = stylelint.lint({
      code: invalidCss,
      config
    });
  });

  it('did error', () => {
    return result.then(data => expect(data.errored).toBeTruthy());
  });

  it('flags three warnings', () => {
    return result.then(data => expect(data.results[0].warnings.length).toBe(3));
  });

  it('correct warning text', () => {
    return result.then(data =>
      expect(data.results[0].warnings[0].text).toBe(
        'Insert ";" (prettier/prettier)'
      )
    );
  });

  it('correct rule flagged', () => {
    return result.then(data =>
      expect(data.results[0].warnings[0].rule).toBe('prettier/prettier')
    );
  });

  it('correct severity flagged', () => {
    return result.then(data =>
      expect(data.results[0].warnings[0].severity).toBe('error')
    );
  });
});
