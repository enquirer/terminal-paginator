'use strict';

var debug = require('debug')('terminal-paginator');
var log = require('log-utils');

/**
 * The paginator keeps track of a position index in a list
 * and returns a subset of the choices if the list is too
 * long.
 */

function Paginator(options) {
  debug('initializing from <%s>', __filename);
  this.options = options || {};
  this.footer = this.options.footer || '(Move up and down to reveal more choices)';
  this.firstRender = true;
  this.lastIndex = 0;
  this.position = 0;
}

Paginator.prototype.paginate = function(output, selected, limit) {
  limit = limit || this.options.limit || 7;
  var lines = output.split('\n');

  // Return if we don't have enough visible lines to paginate
  if (lines.length <= limit) {
    return output;
  }

  // get the approximate "middle" of the visible list
  var middle = Math.floor(limit / 2);

  // Move the position when a down keypress is entered, and limit
  // it to approximately half the length of the limit to keep the
  // position the middle of the visible list
  if (this.position < middle && this.lastIndex < selected && selected - this.lastIndex < limit) {
    this.position = Math.min(middle, this.position + selected - this.lastIndex);
  }

  // store reference to the index of the currently selected item
  this.lastIndex = selected;

  // Duplicate lines to create the illusion of an infinite list
  var infinite = lines.concat(lines).concat(lines).filter(Boolean);
  var topIndex = Math.max(0, selected + lines.length - this.position);

  if (this.options.radio === true && this.firstRender) {
    this.firstRender = false;
    topIndex = 0;
    if (!infinite[0].trim()) {
      topIndex++;
    }
  }

  // Create the visible list based on the limit and current cursor position
  var visible = infinite.splice(topIndex, limit).join('\n');
  visible += '\n';
  visible += log.dim(this.footer);

  // ensure that output has a leading newline, so that the first
  // list item begins on the next line after the prompt question
  if (visible.charAt(0) !== '\n') {
    visible = '\n' + visible;
  }

  return visible;
};

/**
 * Expose `Paginator`
 */

module.exports = Paginator;
