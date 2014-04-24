/**
 * Copyright (C) 2014 Leonardo Rossi <leonardo.rossi@studenti.unipr.it>
 *
 * This source code is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This source code is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this source code; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA
 *
 */

var WIDTH  = 100;
var HEIGHT = 100;
var POBLATION_DENSITY = .5;

var current_field = _.range(WIDTH).map( function(){
	return _.range(HEIGHT).map( function(){
		return Math.random() < POBLATION_DENSITY;
	});
});

function count_neigs( current_field, x, y ){
	var offset = [ -1, 0, 1 ];
	var count = 0;
	
	_(offset).each(function(offset_x){
		_(offset).each(function(offset_y){
			if( offset_x != 0 || offset_y != 0 )
			{
				if( current_field
					[ (x+offset_x+WIDTH )%WIDTH  ]
					[ (y+offset_y+HEIGHT)%HEIGHT ] )
					count ++;
			}
		});
	});
	
	return count;
}

function update_model(){
	var neigs_count = _(current_field).map( function( col, x ){
		return _( col ).map( function( cell, y ){
			return count_neigs( current_field, x, y );
		});
	});

	// alive o death
	current_field = _(neigs_count).map( function( col, x ){
		return _( col ).map( function( neighbours, y ){
			// save if the cell is alive or dead
			var is_live = current_field[x][y];

			// Any live cell with fewer than two live neighbours dies, as if caused by under-population.
			if(is_live && neighbours < 2) return false;
			// Any live cell with two or three live neighbours lives on to the next generation.
			if(is_live && neighbours == 2 || neighbours == 3) return true;
			// Any live cell with more than three live neighbours dies, as if by overcrowding.
			if(is_live && neighbours > 3) return false;
			// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
			if(!is_live && neighbours == 3) return true;
			// otherwise, the cell is dead.
			return false;
		});
	});
}

function update_view(){
	var output = _(current_field).map( function( col ){
		return _( col ).map( function( cell ){
			if( cell )
				return 'o';
			else
				return ' ';
		}).join("") + "\n";
	}).join("");

	field.innerHTML = output;
}

function tick(){
	update_model();
	update_view();
}

setInterval( tick, 50 );
