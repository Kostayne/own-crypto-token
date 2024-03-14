<script lang="ts">
	import { gs } from 'get-module-style';
	import { createEventDispatcher } from 'svelte';
	import Select from 'svelte-select';

	// c
	import Input from '@c/Input.svelte';
	import Button from '@c/buttons/Button.svelte';

	// types
	import type { ApiConnectionSettings } from '@t/ConnectionData/apiConnectionSettings.type';
	import type { SelectOptionType } from '@t/selectOption.type';

	// validators
	import { validateRequiredStr } from '@validators/requiredStrValidator';

	// props
	export let className = '';

	const dispatch = createEventDispatcher();

	// state
	let connectionType: 'rpc' | 'api' = 'api';

	// apiState
	let apiPlatform: ApiConnectionSettings['platform'] = 'infura';
	let apiNetwork: ApiConnectionSettings['network'] = 'goerli';
	let apiKey = '';

	// api -> infura
	let infuraProjectId = '';
	let infuraSecret = '';

	// api -> pocket
	let pocketId = '';
	let pocketSecret = '';

	// rpcState
	let rpcUrl = '';

	// options
	const platformSelectItems: SelectOptionType<ApiConnectionSettings['platform']>[] = [
		{
			value: 'alchemy',
			label: 'Alchemy',
		},

		{
			value: 'ankr',
			label: 'Ankr',
		},

		{
			value: 'cloudflare',
			label: 'Cloudflare',
		},

		{
			value: 'etherscan',
			label: 'Etherscan',
		},

		{
			value: 'infura',
			label: 'Infura',
		},

		{
			value: 'pocket',
			label: 'Pocket',
		},
	];

	const networkSelectOptions: SelectOptionType<ApiConnectionSettings['network']>[] = [
		{
			label: 'Goerli',
			value: 'goerli',
		},

		{
			label: 'Sepolia',
			value: 'sepolia',
		},
	];

	// validation
	$: apiKeyErr = validateRequiredStr(apiKey);
	$: infuraIdErr = validateRequiredStr(infuraProjectId);
	$: infuraSecretErr = validateRequiredStr(infuraSecret);
	$: pocketIdErr = validateRequiredStr(pocketId);
	$: pocketSecretErr = validateRequiredStr(pocketSecret);

	$: rpcUrlErr = validateRequiredStr(rpcUrl);

	const getIsFormValid = (...args: any[]): boolean => {
		if (connectionType === 'rpc') {
			return rpcUrlErr === '';
		}

		if (connectionType === 'api') {
			if (apiPlatform === 'infura') {
				return [infuraIdErr, infuraSecretErr].every((v) => v === '');
			}

			if (apiPlatform === 'pocket') {
				return [pocketIdErr, pocketSecretErr].every((v) => v === '');
			}

			if (apiPlatform === 'cloudflare') {
				return true;
			}

			return apiKeyErr === '';
		}

		// unknown connection type
		console.error('Unknown connection type!');
		return false;
	};

	$: isSubmitDisabled = !getIsFormValid(
		rpcUrlErr,
		apiKeyErr,
		infuraIdErr,
		infuraSecretErr,
		pocketIdErr,
		pocketSecretErr,
	);
</script>

<div class={gs(className, 'flex items-center justify-between gap-3')}>
	<span class="flex-shrink-0">Connection type</span>

	<Select
		items={['api', 'rpc']}
		value={connectionType}
		clearable={false}
		searchable={false}
		on:change={(e) => {
			connectionType = e.detail.value;
		}}
	/>
</div>

{#if connectionType === 'api'}
	<!-- svelte-ignore a11y-label-has-associated-control -->
	<label class="flex flex-col gap-2 mt-2">
		<span>Platform</span>

		<Select
			items={platformSelectItems}
			value={apiPlatform}
			clearable={false}
			on:change={(e) => {
				apiPlatform = e.detail.value;
			}}
		/>
	</label>

	<!-- svelte-ignore a11y-label-has-associated-control -->
	<label class="mt-2 flex flex-col gap-2">
		<span>Network</span>

		<Select
			items={networkSelectOptions}
			value={apiNetwork}
			clearable={false}
			searchable={false}
			on:change={(e) => {
				apiNetwork = e.detail.value;
			}}
		/>
	</label>

	{#if apiPlatform === 'infura'}
		<Input bind:value={infuraProjectId} error={infuraIdErr} label="Project id" className="mt-3" />

		<Input bind:value={infuraSecret} error={infuraSecretErr} label="Secret" className="mt-3" />
	{/if}

	{#if apiPlatform === 'pocket'}
		<Input bind:value={pocketId} error={pocketIdErr} label="App id" className="mt-3" />
		<Input bind:value={pocketSecret} error={pocketSecretErr} label="Secret" className="mt-3" />
	{/if}

	{#if !['infura', 'pocket', 'cloudflare'].includes(apiPlatform)}
		<Input bind:value={apiKey} error={apiKeyErr} label="Api key" className="mt-3" />
	{/if}
{/if}

{#if connectionType === 'rpc'}
	<Input bind:value={rpcUrl} error={rpcUrlErr} label="Url" className="mt-2 w-full" />
{/if}

<div class="mt-4 w-full flex justify-between">
	<Button
		type="primary"
		disabled={isSubmitDisabled}
		className="w-[115px]"
		on:click={() => {
			dispatch('save', {
				apiKey,
				apiPlatform,
				apiNetwork,

				infuraProjectId,
				infuraSecret,

				pocketId,
				pocketSecret,

				rpcUrl,
			});
		}}
	>
		SAVE
	</Button>

	<Button type="secondary" on:click={() => dispatch('cancel')}>CANCEL</Button>
</div>