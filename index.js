'use strict';

var flatten = require('arr-flatten');
var log = require('log-utils');

/**
 * The paginator keeps track of a pointer index in a list
 * and returns a subset of the choices if the list is too
 * long.
 */

function Paginator(options) {
  this.options = options || {};
  this.lastIndex = 0;
  this.pointer = 0;
}

Paginator.prototype.paginate = function(output, selected, pageSize) {
  pageSize = pageSize || this.options.pageSize || 7;
  var lines = output.split('\n');

  // Make sure there's enough lines to paginate
  if (lines.length <= pageSize + 2) {
    return output;
  }

  // Move the pointer when a down keypress is entered, and limit it to 3
  if (this.pointer < 3 && this.lastIndex < selected && selected - this.lastIndex < 9) {
    this.pointer = Math.min(3, this.pointer + selected - this.lastIndex);
  }

  this.lastIndex = selected;

  // Duplicate the lines so it give an infinite list look
  var infinite = flatten([lines, lines, lines]);
  var topIndex = Math.max(0, selected + lines.length - this.pointer);

  var section = infinite.splice(topIndex, pageSize).join('\n');
  return section + '\n' + log.dim('(Move up and down to reveal more choices)');
};

/**
 * Expose `Paginator`
 */

module.exports = Paginator;
