import { describe, it, expect } from 'vitest';
import { parsePropertiesString } from '../../utility/parseProperties';

describe('parsePropertiesString', () => {
  it('should parse simple key-value pairs', () => {
    const input = 'key1=value1\nkey2=value2';
    const result = parsePropertiesString(input);

    expect(result).toEqual({
      key1: 'value1',
      key2: 'value2',
    });
  });

  it('should handle empty input', () => {
    const result = parsePropertiesString('');
    expect(result).toEqual({});
  });

  it('should ignore empty lines', () => {
    const input = 'key1=value1\n\nkey2=value2\n';
    const result = parsePropertiesString(input);

    expect(result).toEqual({
      key1: 'value1',
      key2: 'value2',
    });
  });

  it('should ignore comment lines starting with #', () => {
    const input = '# This is a comment\nkey1=value1\n# Another comment\nkey2=value2';
    const result = parsePropertiesString(input);

    expect(result).toEqual({
      key1: 'value1',
      key2: 'value2',
    });
  });

  it('should handle lines without equals sign', () => {
    const input = 'key1=value1\ninvalid line\nkey2=value2';
    const result = parsePropertiesString(input);

    expect(result).toEqual({
      key1: 'value1',
      key2: 'value2',
    });
  });

  it('should trim whitespace around keys and values', () => {
    const input = '  key1  =  value1  \n  key2=value2';
    const result = parsePropertiesString(input);

    expect(result).toEqual({
      key1: 'value1',
      key2: 'value2',
    });
  });

  it('should handle multiple equals signs in value', () => {
    const input = 'key1=value=with=equals\nkey2=normal';
    const result = parsePropertiesString(input);

    expect(result).toEqual({
      key1: 'value=with=equals',
      key2: 'normal',
    });
  });

  it('should handle empty values', () => {
    const input = 'key1=\nkey2=value2';
    const result = parsePropertiesString(input);

    expect(result).toEqual({
      key1: '',
      key2: 'value2',
    });
  });

  it('should handle keys without values', () => {
    const input = 'key1=\nkey2';
    const result = parsePropertiesString(input);

    expect(result).toEqual({
      key1: '',
    });
  });

  it('should handle Windows line endings (CRLF)', () => {
    const input = 'key1=value1\r\nkey2=value2';
    const result = parsePropertiesString(input);

    expect(result).toEqual({
      key1: 'value1',
      key2: 'value2',
    });
  });

  it('should handle mixed line endings', () => {
    const input = 'key1=value1\nkey2=value2\r\nkey3=value3';
    const result = parsePropertiesString(input);

    expect(result).toEqual({
      key1: 'value1',
      key2: 'value2',
      key3: 'value3',
    });
  });

  it('should preserve case sensitivity', () => {
    const input = 'Key1=value1\nkey1=value2\nKEY1=value3';
    const result = parsePropertiesString(input);

    expect(result).toEqual({
      Key1: 'value1',
      key1: 'value2',
      KEY1: 'value3',
    });
  });

  it('should handle special characters in values', () => {
    const input = 'key1=value with spaces\nkey2=value-with-dashes\nkey3=value_with_underscores';
    const result = parsePropertiesString(input);

    expect(result).toEqual({
      key1: 'value with spaces',
      key2: 'value-with-dashes',
      key3: 'value_with_underscores',
    });
  });

  it('should handle complex real-world example', () => {
    const input = `# Application Configuration
app.name=My App
app.version=1.0.0
database.url=jdbc:mysql://localhost:3306/myapp
database.username=admin
database.password=secret123
# Feature flags
feature.login=true
feature.registration=false
`;

    const result = parsePropertiesString(input);

    expect(result).toEqual({
      'app.name': 'My App',
      'app.version': '1.0.0',
      'database.url': 'jdbc:mysql://localhost:3306/myapp',
      'database.username': 'admin',
      'database.password': 'secret123',
      'feature.login': 'true',
      'feature.registration': 'false',
    });
  });
});
