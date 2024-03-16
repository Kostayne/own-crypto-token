<script lang="ts">
	import { gs } from 'get-module-style';
	import { createEventDispatcher } from 'svelte';
	import Select from 'svelte-select';

	// c
	import Input from '@c/Input.svelte';
	import Button from '@c/buttons/Button.svelte';

	// store
	import { getGlobalStore } from '@stores/globalStore/globalStore.selector';
	import { ConnectionActions } from '@stores/globalStore/actions/connectionActions';

	// types
	import type { ApiConnectionSettings } from '@t/ConnectionData/apiConnectionSettings.type';
	import type { SelectOptionType } from '@t/selectOption.type';
	import type { ConnectionData } from '@t/connectionData.type';

	// validators
	import { validateRequiredStr } from '@validators/requiredStrValidator';

	// props
	export let className = '';
	export let hideCancelButton = false;

	// store
	const globalStore = getGlobalStore();
	const actions = new ConnectionActions(globalStore);
	const connData = $globalStore?.encrypted?.connectionData;

	const dispatch = createEventDispatcher();

	// state
	let connectionType: 'rpc' | 'api' = connData?.type || 'rpc';

	// apiState
	let apiPlatform: ApiConnectionSettings['platform'] = connData?.api?.platform || 'infura';
	let apiNetwork: ApiConnectionSettings['network'] = connData?.api?.network || 'goerli';
	let apiKey = connData?.api?.apiKey || '';

	// api -> infura
	let infuraProjectId = connData?.api?.infura?.projectId || '';
	let infuraSecret = connData?.api?.infura?.projectSecret || '';

	// api -> pocket
	let pocketId = connData?.api?.pocket?.appId || '';
	let pocketSecret = connData?.api?.pocket?.appSecret || '';

	// rpcState
	let rpcUrl = connData?.rpc?.url || '';

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

	// utils
	// ===============
	// we need to define args so svelte can react on changes
	const getIsFormValid = (..._args: any[]): boolean => {
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

	const getConnectionData = (): ConnectionData => {
		return {
			type: connectionType,

			api: {
				apiKey,
				network: apiNetwork,

				platform: apiPlatform,

				infura: {
					projectId: infuraProjectId,
					projectSecret: infuraSecret,
				},

				pocket: {
					appId: pocketId,
					appSecret: pocketSecret,
				},
			},

			rpc: {
				url: rpcUrl,
			},
		};
	};

	// events handlers
	const onSaveClick = async () => {
		actions.setConnectionData(getConnectionData());
		const connRes = await actions.establishConnection();

		// passing error to parent component
		// which will display the error form
		if (connRes.isError) {
			dispatch('connectionErr', connRes.unwrapErr());
			return;
		}

		dispatch('connectionSuccess');
	};

	// computed
	$: isSubmitDisabled = !getIsFormValid(
		rpcUrlErr,
		apiKeyErr,
		infuraIdErr,
		infuraSecretErr,
		pocketIdErr,
		pocketSecretErr,
	);
</script>

<!-- Connection type span with selector, inlined -->
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

<!-- api specific inputs -->
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

	<!-- infura specific -->
	{#if apiPlatform === 'infura'}
		<Input bind:value={infuraProjectId} error={infuraIdErr} label="Project id" className="mt-3" />

		<Input bind:value={infuraSecret} error={infuraSecretErr} label="Secret" className="mt-3" />
	{/if}

	<!-- pocket specific -->
	{#if apiPlatform === 'pocket'}
		<Input bind:value={pocketId} error={pocketIdErr} label="App id" className="mt-3" />
		<Input bind:value={pocketSecret} error={pocketSecretErr} label="Secret" className="mt-3" />
	{/if}

	<!-- a common field for many api platforms -->
	{#if !['infura', 'pocket', 'cloudflare'].includes(apiPlatform)}
		<Input bind:value={apiKey} error={apiKeyErr} label="Api key" className="mt-3" />
	{/if}
{/if}

<!-- rpc specific -->
{#if connectionType === 'rpc'}
	<Input bind:value={rpcUrl} error={rpcUrlErr} label="Url" className="mt-2 w-full" />
{/if}

<div class="mt-4 w-full flex justify-between">
	<Button
		type="primary"
		disabled={isSubmitDisabled}
		className={gs(hideCancelButton ? 'w-full max-w-full' : 'w-[115px]')}
		on:click={onSaveClick}
	>
		SAVE
	</Button>

	{#if !hideCancelButton}
		<Button type="secondary" on:click={() => dispatch('cancel')}>CANCEL</Button>
	{/if}
</div>
