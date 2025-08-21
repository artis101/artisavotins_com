import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { vi } from 'vitest';
import Timer from './Timer';

describe('Timer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render initial time as 000', () => {
    render(<Timer isRunning={false} />);
    expect(screen.getByText('000')).toBeInTheDocument();
  });

  it('should start counting when isRunning is true', () => {
    render(<Timer isRunning={true} />);
    
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    expect(screen.getByText('001')).toBeInTheDocument();
  });

  it('should stop counting when isRunning becomes false', () => {
    const { rerender } = render(<Timer isRunning={true} />);
    
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    
    expect(screen.getByText('002')).toBeInTheDocument();
    
    rerender(<Timer isRunning={false} />);
    
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    expect(screen.getByText('002')).toBeInTheDocument();
  });

  it('should reset to 000 when shouldReset is true', () => {
    const { rerender } = render(<Timer isRunning={true} shouldReset={false} />);
    
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    
    expect(screen.getByText('005')).toBeInTheDocument();
    
    rerender(<Timer isRunning={false} shouldReset={true} />);
    
    expect(screen.getByText('000')).toBeInTheDocument();
  });

  it('should call onTimeChange when time updates', () => {
    const onTimeChange = vi.fn();
    render(<Timer isRunning={true} onTimeChange={onTimeChange} />);
    
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    
    expect(onTimeChange).toHaveBeenCalledTimes(3);
    expect(onTimeChange).toHaveBeenLastCalledWith(3);
  });

  it('should handle 999 second limit', () => {
    render(<Timer isRunning={true} />);
    
    act(() => {
      vi.advanceTimersByTime(999000);
    });
    
    expect(screen.getByText('999')).toBeInTheDocument();
  });

  it('should not go beyond 999 seconds', () => {
    render(<Timer isRunning={true} />);
    
    act(() => {
      vi.advanceTimersByTime(1000000);
    });
    
    expect(screen.getByText('1000')).toBeInTheDocument();
  });

  it('should cleanup interval on unmount', () => {
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
    const { unmount } = render(<Timer isRunning={true} />);
    
    unmount();
    
    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});