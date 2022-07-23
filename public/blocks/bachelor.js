/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 *
 * @fileoverview Description.
 */
'use strict';

/* zur Verwendung aller Blöcke müssen mehrere Librarys auf dem Raspberry Pi vorinstalliert werden.
 * für Sensor scd30: (1) https://pypi.org/project/scd30-i2c/ 
 * für Sensor sgp30: (1) https://pypi.org/project/grove.py/ (2) https://pypi.org/project/seeed-python-sgp30/
 * zur Ausgabe des Live-Graphen: (1) https://pypi.org/project/matplotlib/
 * 
 * Zudem müssen i2c-Devices auf dem Raspberry Pi enabled sein. 
 */


/*
 * Hier folgt die Definition der Blöcke
 * 
 */



Blockly.Blocks['use_scd30'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Benutze Sensor scd30");
    this.appendStatementInput("blocks")
        .setCheck(null);
    this.setColour(105);
  }
};

Blockly.Python['use_scd30'] = function(block) {
  var statements_blocks = Blockly.Python.statementToCode(block, 'blocks');
  // TODO: Assemble Python into code variable.
  var importLibraries = 'import matplotlib.pyplot as plt\n' +
  'import time\n' + 'from scd30_i2c import SCD30 \n \n';
  //
  var scd30Setup = 'scd30 = SCD30()\n' +
  'scd30.set_measurement_interval(2) \nscd30.start_periodic_measurement()\n \n';
  //
  var variablenInitialisierung = 'x=[] \ny=[] \nyAxisHigh = 0 \nyAxisLow = 100000 \n'+
  'gemessenerWert = -1 \nmessungsZaehler = 0 \ngraphExistiert = False\n \n';
  //
  var messungCO2 = 'def messungCO2():\n' +
  '    messungErfolgt = False\n' +
  '    while not messungErfolgt:\n' +
  '        if scd30.get_data_ready():\n' +
  '            m = scd30.read_measurement()\n' +
  '            if m is not None:\n' +
  '                messWert = int(m[0])\n' +
  '                print(f"CO2: {m[0]:.2f}ppm")\n' +
  '                messungErfolgt = True\n' +
  '        else:\n' +
  '            time.sleep(0.2)\n' +
  '    return messWert\n \n';
  //
  var plotGraphen = 'def verwendeGraphen(gemessenerWert):\n'+   
  '    global messungsZaehler, yAxisLow, yAxisHigh\n    messungsZaehler = messungsZaehler + 1\n' +
  '    x.append(messungsZaehler)\n    y.append(gemessenerWert)\n' +
  '    if (gemessenerWert - 40) < yAxisLow:\n' +
  '        yAxisLow = gemessenerWert - 40\n' +
  '    if (gemessenerWert + 40) > yAxisHigh:\n' +
  '        yAxisHigh = gemessenerWert + 40\n' +
  '    plt.ylim(yAxisLow, yAxisHigh) \n    plt.plot(x, y,\'b\')\n' +
  '    plt.title("gemessene Daten")\n    plt.xlabel("Messungsnummer")\n'+
  '    plt.ylabel("CO2-Gehalt [ppm]")\n    plt.pause(0.2)\n \n';
  //--
  var zeigeGraphenNachAbschluss = '\nif graphExistiert:\n    plt.show()\n';
  var code = importLibraries + scd30Setup + variablenInitialisierung + messungCO2 + plotGraphen +
  '\neingefuegterCode = True \nwhile eingefuegterCode:\n' + statements_blocks +
  '\n  eingefuegterCode = False\n' + zeigeGraphenNachAbschluss ;
  return code;
};


/*****/


Blockly.Blocks['use_sgp30'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Benutze Sensor sgp30");
    this.appendStatementInput("blocks")
        .setCheck(null);
    this.setColour(105);
  }
};

Blockly.Python['use_sgp30'] = function(block) {
  var statements_blocks = Blockly.Python.statementToCode(block, 'blocks');
  // TODO: Assemble Python into code variable.
  var importLibraries = 'import matplotlib.pyplot as plt\n' +
  'import time\n' + 'import seeed_sgp30 \nfrom grove.i2c import Bus \n';
  //
  var sgp30Setup = 'sgp30 = seeed_sgp30.grove_sgp30(Bus(1))\n \n';
  //
  var variablenInitialisierung = 'x=[] \ny=[] \nyAxisHigh = 0 \nyAxisLow = 100000 \n'+
  'gemessenerWert = -1 \nmessungsZaehler = 0 \ngraphExistiert = False\n \n';
  //
  var messungCO2 = 'def messungCO2():\n' +
  '    data = sgp30.read_measurements()\n' +
  '    messWertCO2, messWertTVOC = data.data\n' +
  '    print("ppb CO2eq = {} ppm  ".format(messWertCO2))\n' +
  '    return messWertCO2\n \n';
  //
  var plotGraphen = 'def verwendeGraphen(gemessenerWert):\n'+   
  '    global messungsZaehler, yAxisLow, yAxisHigh\n    messungsZaehler = messungsZaehler + 1\n' +
  '    x.append(messungsZaehler)\n    y.append(gemessenerWert)\n' +
  '    if (gemessenerWert - 40) < yAxisLow:\n' +
  '        yAxisLow = gemessenerWert - 40\n' +
  '    if (gemessenerWert + 40) > yAxisHigh:\n' +
  '        yAxisHigh = gemessenerWert + 40\n' +
  '    plt.ylim(yAxisLow, yAxisHigh) \n    plt.plot(x, y,\'b\')\n' +
  '    plt.title("gemessene Daten")\n    plt.xlabel("Messungsnummer")\n'+
  '    plt.ylabel("CO2-Gehalt [ppm]")\n    plt.pause(0.2)\n \n';
  //--
  var zeigeGraphenNachAbschluss = '\nif graphExistiert:\n    plt.show()\n';
  var code = importLibraries + sgp30Setup + variablenInitialisierung + messungCO2 + plotGraphen +
  '\neingefuegterCode = True \nwhile eingefuegterCode:\n' + statements_blocks +
  '\n  eingefuegterCode = False\n' + zeigeGraphenNachAbschluss ;
  return code;
};


/*****/


Blockly.Blocks['use_mq135'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Benutze Sensor MQ135");
    this.appendStatementInput("blocks")
        .setCheck(null);
    this.setColour(105);
  }
};

Blockly.Python['use_mq135'] = function(block) {
  var statements_blocks = Blockly.Python.statementToCode(block, 'blocks');
  // TODO: Assemble Python into code variable.
  var importLibraries = 'import matplotlib.pyplot as plt\n' +
  'import time\n' + 'import RPi.GPIO as GPIO \n \n';
  //
  var gpioSetup = 'GPIO.setmode(GPIO.BCM)\n' + 'GPIO.setup(14, GPIO.IN)\n \n';
  //
  var variablenInitialisierung = 'x=[] \ny=[] \n \n'+
  'gemessenerWert = -1 \nmessungsZaehler = 0 \ngraphExistiert = False\n \n';
  //
  var messungCO2 = 'def messungCO2():\n' +
  '    messWert = not GPIO.input(14)\n' +
  '    return messWert \n \n';
  //
  var plotGraphen = 'def verwendeGraphen(gemessenerWert):\n'+   
  '    global messungsZaehler\n    messungsZaehler = messungsZaehler + 1\n' +
  '    x.append(messungsZaehler)\n    y.append(gemessenerWert)\n' +
  '    plt.ylim(-0.5, 1.5)\n    plt.plot(x, y,\'b\')\n' +
  '    plt.title("gemessene Daten")\n    plt.xlabel("Messungsnummer")\n'+
  '    plt.ylabel("CO2-Gehalt [ppm]")\n    plt.pause(0.2)\n \n';
  //--
  var zeigeGraphenNachAbschluss = '\nif graphExistiert:\n    plt.show()\n';
  var code = importLibraries + gpioSetup + variablenInitialisierung + messungCO2 + plotGraphen +
  '\neingefuegterCode = True \nwhile eingefuegterCode:\n' + statements_blocks +
  '\n  eingefuegterCode = False\n' + zeigeGraphenNachAbschluss ;
  return code;
};


/*****/


Blockly.Blocks['measure_in_varseconds'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("messe CO2 in");
    this.appendValueInput("seconds")
        .setCheck("Number");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Sekunden");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
  }
};

Blockly.Python['measure_in_varseconds'] = function(block) {
  var value_seconds = Blockly.Python.valueToCode(block, 'seconds', Blockly.Python.ORDER_ATOMIC);
  // TODO: Assemble Python into code variable.
  var code = 'time.sleep(' + value_seconds +')\ngemessenerWert = messungCO2()\n \n';
  return code;
};


/*****/


Blockly.Blocks['show_graph'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("zeige Messung in Graphen an");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
  }
};

Blockly.Python['show_graph'] = function(block) {
  // TODO: Assemble Python into code variable.
  var code = 'graphExistiert = True\n'+
    'wertZumPlotten = gemessenerWert\n'+
    'verwendeGraphen(wertZumPlotten)\n';
  //code = Blockly.Python.INDENT(code);
  return code;
};


/*****/

Blockly.Blocks['iteration'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("wiederhole");
    this.appendValueInput("quantity")
        .setCheck("Number");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("mal");
    this.appendStatementInput("statements")
        .setCheck(null);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(180);
  }
};

Blockly.Python['iteration'] = function(block) {
  var value_quantity = Blockly.Python.valueToCode(block, 'quantity', Blockly.Python.ORDER_ATOMIC);
  var statements_statements = Blockly.Python.statementToCode(block, 'statements');
  // TODO: Assemble Python into code variable.
  var code = 'anzahlDurchlaeufe = ' + value_quantity +
  '\nfor i in range(anzahlDurchlaeufe):\n' + statements_statements;
  return code;
};
