import { describe, expect, it } from 'vitest';
import { cn } from '../lib/utils';

describe('cn', () => {
  it('merges class strings', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('handles no arguments', () => {
    expect(cn()).toBe('');
  });

  it('handles falsy values', () => {
    expect(cn('a', undefined, null as never, false as never, '')).toBe('a');
  });

  it('filters with conditional object syntax', () => {
    expect(cn({ foo: true, bar: false })).toBe('foo');
  });

  it('resolves tailwind conflicting classes (last wins)', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('handles arrays of classes', () => {
    expect(cn(['a', 'b'], 'c')).toBe('a b c');
  });

  it('handles mixed conditional and literal classes', () => {
    const active = true;
    expect(cn('base', active && 'active', !active && 'inactive')).toBe('base active');
  });
});
