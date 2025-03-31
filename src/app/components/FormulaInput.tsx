'use client';

import React, { useState, ChangeEvent, KeyboardEvent, useEffect, useRef } from 'react';
import { useFormulaStore } from '../store/formulaStore';

export default function FormulaInput() {
  const [input, setInput] = useState('');
  const [variableInput, setVariableInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addTag, tags, calculate, clearTags, variables, setVariable } = useFormulaStore();

  const getVariableSuggestions = (value: string) => {
    const varNames = Object.keys(variables);
    const operators = ['+', '-', '*', '/'];
    const allSuggestions = [...varNames, ...operators];
    return value
      ? allSuggestions.filter(v => v.toLowerCase().startsWith(value.toLowerCase()))
      : [];
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    const newSuggestions = getVariableSuggestions(value);
    setSuggestions(newSuggestions);
    setSelectedIndex(0);
  };

  const insertTagAtPosition = (value: string, position: number) => {
    const newTags = [...tags];
    newTags.splice(position, 0, value);
    useFormulaStore.setState({ tags: newTags });
    setCursorPosition(position + 1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const caretAtStart = inputRef.current?.selectionStart === 0;
    const caretAtEnd = inputRef.current?.selectionEnd === input.length;

    if (e.key === 'ArrowLeft' && caretAtStart) {
      e.preventDefault();
      if (cursorPosition === -1) {
        setCursorPosition(tags.length);
      } else {
        setCursorPosition(Math.max(0, cursorPosition - 1));
      }
    }
    
    if (e.key === 'ArrowRight' && caretAtEnd) {
      e.preventDefault();
      if (cursorPosition === -1) {
        setCursorPosition(0);
      } else {
        setCursorPosition(Math.min(tags.length, cursorPosition + 1));
      }
    }

    if (e.key === 'Backspace') {
      if (input === '' && tags.length > 0) {
        e.preventDefault();
        if (cursorPosition > 0) {
          removeTag(cursorPosition - 1);
          setCursorPosition(cursorPosition - 1);
        } else if (cursorPosition === -1) {
          removeTag(tags.length - 1);
        }
      }
    }

    if (suggestions.length > 0) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % suggestions.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
          break;
        case 'Enter':
          if (suggestions[selectedIndex]) {
            e.preventDefault();
            if (cursorPosition === -1) {
              addTag(suggestions[selectedIndex]);
              setCursorPosition(tags.length + 1);
            } else {
              insertTagAtPosition(suggestions[selectedIndex], cursorPosition);
            }
            setInput('');
            setSuggestions([]);
          }
          break;
        case 'Escape':
          setSuggestions([]);
          setSelectedIndex(0);
          break;
      }
    } else if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      if (cursorPosition === -1) {
        addTag(input.trim());
        setCursorPosition(tags.length + 1);
      } else {
        insertTagAtPosition(input.trim(), cursorPosition);
      }
      setInput('');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (cursorPosition === -1) {
      addTag(suggestion);
      setCursorPosition(tags.length + 1);
    } else {
      insertTagAtPosition(suggestion, cursorPosition);
    }
    setInput('');
    setSuggestions([]);
  };

  const handleVariableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const match = variableInput.match(/^(\w+)\s*=\s*(\d+(\.\d+)?)$/);
    if (match) {
      const [, name, value] = match;
      setVariable(name, parseFloat(value));
      setVariableInput('');
    }
  };

  const removeTag = (index: number) => {
    if (index < 0) return;
    const newTags = [...tags];
    newTags.splice(index, 1);
    useFormulaStore.setState({ tags: newTags });
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setSuggestions([]);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const result = useFormulaStore.getState().result;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 min-h-[3rem] items-center p-2 rounded-2xl bg-surface/30 border border-white/5">
        {tags.map((tag, index) => {
          const type = isNaN(Number(tag)) ? (
            ['+', '-', '*', '/'].includes(tag) ? 'operator' : 'variable'
          ) : 'number';
          
          return (
            <React.Fragment key={index}>
              {index === cursorPosition && (
                <div className="w-0.5 h-5 bg-accent animate-pulse mx-1" />
              )}
              <span 
                className={`tag tag-${type} flex items-center`}
                onClick={() => setCursorPosition(index)}
              >
                {tag}
                <button 
                  className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTag(index);
                    if (cursorPosition > index) {
                      setCursorPosition(prev => prev - 1);
                    }
                  }}
                >
                  &times;
                </button>
              </span>
            </React.Fragment>
          );
        })}
        {cursorPosition === tags.length && (
          <div className="w-0.5 h-5 bg-accent animate-pulse mx-1" />
        )}
      </div>
      
      <div className="flex gap-4 relative">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onClick={() => setCursorPosition(-1)}
          placeholder="Type a number or operator and press enter..."
          className="input-base w-full h-14"
          autoFocus
        />
        {suggestions.length > 0 && (
          <div className="suggestion-container absolute left-0 right-0 top-full">
            {suggestions.map((suggestion, index) => (
              <div
                key={suggestion}
                className={`suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleVariableSubmit} className="flex gap-4">
        <input
          type="text"
          value={variableInput}
          onChange={(e) => setVariableInput(e.target.value)}
          placeholder="Set variable (e.g. revenue = 1000)"
          className="input-base flex-1 h-14"
        />
        <button
          type="submit"
          className="calculate-button min-w-[140px]"
        >
          Set Variable
        </button>
      </form>

      {Object.entries(variables).length > 0 && (
        <div className="bg-surface/30 rounded-2xl border border-white/5 p-6">
          <h3 className="text-sm font-medium text-white/80 mb-3">Variables</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(variables).map(([name, value]) => (
              <div key={name} className="tag tag-variable">
                {name} = {value}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={calculate}
          className="calculate-button flex-1 h-14"
        >
          Calculate
        </button>
        <button
          onClick={clearTags}
          className="start-over-button h-14 min-w-[100px]"
        >
          Clear
        </button>
      </div>

      {result !== null && (
        <div className="result-container">
          <p className="text-lg">
            <span className="text-white/80">Result:</span>{' '}
            <span className="font-medium text-white">{result}</span>
          </p>
        </div>
      )}
    </div>
  );
} 